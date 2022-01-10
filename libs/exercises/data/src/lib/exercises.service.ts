import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  DocumentReference,
} from '@angular/fire/compat/firestore';
import {
  ExerciseBaseData,
  ExerciseMetaDTO,
  ExerciseRequestDTO,
  ExercisesEntity,
  EXERCISE_FIELD_NAMES,
} from '@fitness-tracker/exercises/model';
import {
  convertOneSnap,
  convertSnaps,
  DEFAULT_PAGINATION_STATE,
  LanguagesISO,
  ORDER_BY,
  SearchOptions,
  WithId,
} from '@fitness-tracker/shared/utils';
import firebase from 'firebase/compat/app';
import {
  first,
  map,
  Observable,
  switchMap,
  tap,
  combineLatest,
  from,
  of,
  forkJoin,
} from 'rxjs';
import {
  CollectionReference,
  QueryDocumentSnapshot,
} from '@angular/fire/compat/firestore';
import { COLLECTIONS, LanguageCodes } from 'shared-package';
import {
  shouldSplitToChunks,
  toBaseDataWithId,
  toExerciseTranslation$,
} from './utils/functions/mappers';

@Injectable({
  providedIn: 'root',
})
export class ExercisesService {
  private exerciseDocCash: QueryDocumentSnapshot<ExerciseMetaDTO> | null = null;

  constructor(public readonly afs: AngularFirestore) {}

  public createExercise(
    exercise: ExerciseMetaDTO,
  ): Observable<void | DocumentReference<ExerciseMetaDTO>> {
    const id = exercise.baseData.id;
    return id
      ? from(
          this.afs
            .doc<ExerciseMetaDTO>(`${COLLECTIONS.EXERCISES}/${id}`)
            .set(exercise),
        ).pipe(first())
      : from(
          this.afs
            .collection<ExerciseMetaDTO>(`${COLLECTIONS.EXERCISES}`)
            .add(exercise),
        ).pipe(first());
  }

  public updateExercise(exercise: ExerciseRequestDTO) {
    return from(
      this.afs
        .doc(`${COLLECTIONS.EXERCISES}/${exercise?.baseData?.id}`)
        .update(exercise),
    );
  }

  public findExercisesForWorkout(
    { ids, ...searchOptions }: Pick<SearchOptions, 'ids'>,
    lang: LanguageCodes = LanguagesISO.ENGLISH,
    refresh: boolean = false,
  ): Observable<ExercisesEntity[]> {
    if (ids && !shouldSplitToChunks(ids)) {
      return this.findExercises({ ids, ...searchOptions }, lang, refresh);
    }
    const clonedIds = Array.from(ids);
    const chunk: string[] = clonedIds?.splice(0, 10);

    const result$: Observable<ExercisesEntity[]> = forkJoin([
      this.findExercises({ ids: chunk, ...searchOptions }, lang, refresh),
      this.findExercisesForWorkout(
        { ids: clonedIds, ...searchOptions },
        lang,
        refresh,
      ),
    ]).pipe(map((exercises: ExercisesEntity[][]) => exercises.flat()));

    return result$;
  }

  public findExercises(
    searchOptions: Partial<SearchOptions>,
    lang: LanguageCodes = LanguagesISO.ENGLISH,
    refresh: boolean = false,
  ): Observable<ExercisesEntity[]> {
    return this.afs
      .collection<ExerciseMetaDTO>(
        COLLECTIONS.EXERCISES,
        (ref: CollectionReference) =>
          searchOptions.ids?.length
            ? this.toRefOfWorkoutList({ ref, ...searchOptions })
            : !refresh
            ? this.toPaginatedRef({ ref, ...searchOptions })
            : this.toRefreshRef({ ref, ...searchOptions }),
      )
      .get()
      .pipe(
        tap(
          (snaps: firebase.firestore.QuerySnapshot<ExerciseMetaDTO>) =>
            (this.exerciseDocCash =
              [...snaps.docs][snaps.docs.length - 1] ?? null),
        ),
        map(convertSnaps),

        map((exercises: WithId<ExerciseMetaDTO>[]) =>
          exercises.map(toBaseDataWithId),
        ),
        switchMap((exercisesBaseData: Required<ExerciseBaseData>[]) => {
          const exercisesTranslationsObs = exercisesBaseData.map(
            toExerciseTranslation$.call(this, lang),
          );

          return exercisesBaseData?.length
            ? combineLatest(exercisesTranslationsObs)
            : of([]);
        }),

        first(),
      );
  }

  public deleteExercise(exerciseId: string): Observable<void> {
    return from(
      this.afs
        .doc<ExercisesEntity>(`${COLLECTIONS.EXERCISES}/${exerciseId}`)
        .delete(),
    );
  }

  public getExerciseDetails(
    exerciseId: string,
    lang: LanguageCodes = LanguagesISO.ENGLISH,
  ): Observable<ExercisesEntity> {
    return this.afs
      .doc<ExerciseMetaDTO>(`${COLLECTIONS.EXERCISES}/${exerciseId}`)
      .get()
      .pipe(
        map<
          firebase.firestore.DocumentSnapshot<ExerciseMetaDTO>,
          WithId<ExerciseMetaDTO>
        >(convertOneSnap),
        map(toBaseDataWithId),
        switchMap(toExerciseTranslation$.call(this, lang)),
      );
  }

  private toPaginatedRef({
    ref,
    targetMuscles,
    sortOrder = ORDER_BY.DESC,
    firstPage = DEFAULT_PAGINATION_STATE.firstPage,
    pageSize = DEFAULT_PAGINATION_STATE.pageSize,
  }: Partial<SearchOptions> & { ref: CollectionReference }) {
    const newRef = this.getExerciseCollectionRef({
      ref,
      targetMuscles,
      sortOrder,
      pageSize,
    }).limit(pageSize);

    return firstPage ? newRef : newRef.startAfter(this.exerciseDocCash);
  }

  private toRefreshRef({
    ref,
    targetMuscles,
    sortOrder = ORDER_BY.DESC,
  }: Partial<SearchOptions> & { ref: CollectionReference }) {
    return this.getExerciseCollectionRef({
      ref,
      sortOrder,
      targetMuscles,
    }).endAt(this.exerciseDocCash);
  }

  private getExerciseCollectionRef({
    ref,
    targetMuscles,
    sortOrder,
  }: Partial<SearchOptions> & { ref: CollectionReference }) {
    const filteredRef = targetMuscles?.length
      ? ref.where(
          new firebase.firestore.FieldPath(
            'baseData',
            EXERCISE_FIELD_NAMES.TARGET_MUSCLE,
          ),
          'in',
          targetMuscles,
        )
      : ref;

    const sortedRef = ref.orderBy(
      new firebase.firestore.FieldPath('baseData', EXERCISE_FIELD_NAMES.RATING),
      sortOrder,
    );

    // TODO FInd out why sorting doesn't work with filtering by targetMuscle

    return filteredRef;
  }

  private toRefOfWorkoutList({
    ref,
    ids,
  }: Partial<SearchOptions> & { ref: CollectionReference }) {
    console.log();

    return ref.where(firebase.firestore.FieldPath.documentId(), 'in', ids);
  }
}
