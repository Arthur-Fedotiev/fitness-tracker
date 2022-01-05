import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  DocumentReference,
} from '@angular/fire/compat/firestore';
import {
  CollectionMetaArray,
  CollectionsMetaKeys,
  ExerciseBaseData,
  ExerciseCollectionsMeta,
  ExerciseMetaDTO,
  ExerciseRequestDTO,
  ExercisesEntity,
  ExercisesMetaCollectionKeyTypes,
  EXERCISE_FIELD_NAMES,
} from '@fitness-tracker/exercises/model';
import {
  convertOneSnap,
  convertSnaps,
  convertSnapsToDictionary,
  DEFAULT_PAGINATION_STATE,
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
  shareReplay,
} from 'rxjs';
import {
  CollectionReference,
  QueryDocumentSnapshot,
} from '@angular/fire/compat/firestore';
import { COLLECTIONS, LanguageCodes } from 'shared-package';
import {
  toBaseDataWithId,
  toExerciseTranslation$,
} from './utils/functions/mappers';

@Injectable({
  providedIn: 'root',
})
export class ExercisesService {
  private exerciseDocCash: QueryDocumentSnapshot<ExerciseMetaDTO> | null = null;
  private readonly metaCollections: readonly [
    COLLECTIONS,
    COLLECTIONS,
    COLLECTIONS,
  ] = [COLLECTIONS.EQUIPMENT, COLLECTIONS.EXERCISE_TYPES, COLLECTIONS.MUSCLES];
  private exercisesMetaCache$: Observable<ExerciseCollectionsMeta> | null =
    null;

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

  public findExercises(
    searchOptions: Partial<SearchOptions>,
    lang: LanguageCodes = 'en',
    refresh: boolean = false,
  ): Observable<ExercisesEntity[]> {
    return this.afs
      .collection<ExerciseMetaDTO>(
        COLLECTIONS.EXERCISES,
        (ref: CollectionReference) =>
          searchOptions.ids?.length
            ? this.toParticularExercisesRef({ ref, ...searchOptions })
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

          return combineLatest(exercisesTranslationsObs);
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
    lang: LanguageCodes = 'en',
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

  get exercisesMeta$(): Observable<ExerciseCollectionsMeta> {
    if (!this.exercisesMetaCache$) {
      this.exercisesMetaCache$ = this.loadExercisesMeta().pipe(shareReplay(1));
    }

    return this.exercisesMetaCache$;
  }

  public loadExercisesMeta(): Observable<ExerciseCollectionsMeta> {
    const metaObs$ = this.metaCollections.reduce(
      (acc, collection: COLLECTIONS) => ({
        ...acc,
        [collection]: this.afs
          .collection<CollectionMetaArray<ExercisesMetaCollectionKeyTypes>>(
            collection,
          )
          .get()
          .pipe(map(convertSnapsToDictionary)),
      }),
      {} as {
        [key in CollectionsMetaKeys]: Observable<ExerciseCollectionsMeta[key]>;
      },
    );

    return combineLatest(metaObs$);
  }

  private toPaginatedRef({
    ref,
    sortOrder = ORDER_BY.DESC,
    firstPage = DEFAULT_PAGINATION_STATE.firstPage,
    pageSize = DEFAULT_PAGINATION_STATE.pageSize,
  }: Partial<SearchOptions> & { ref: CollectionReference }) {
    const newRef = this.getExerciseCollectionRef({
      ref,
      sortOrder,
      pageSize,
    }).limit(pageSize);

    return firstPage ? newRef : newRef.startAfter(this.exerciseDocCash);
  }

  private toRefreshRef({
    ref,
    sortOrder = ORDER_BY.DESC,
  }: Partial<SearchOptions> & { ref: CollectionReference }) {
    return this.getExerciseCollectionRef({ ref, sortOrder }).endAt(
      this.exerciseDocCash,
    );
  }

  private toParticularExercisesRef({
    ref,
    ids,
  }: Partial<SearchOptions> & { ref: CollectionReference }) {
    return ref.where(firebase.firestore.FieldPath.documentId(), 'in', ids);
  }

  private getExerciseCollectionRef({
    ref,
    sortOrder,
  }: Partial<SearchOptions> & { ref: CollectionReference }) {
    return ref?.orderBy(
      new firebase.firestore.FieldPath('baseData', EXERCISE_FIELD_NAMES.RATING),
      sortOrder,
    );
  }
}
