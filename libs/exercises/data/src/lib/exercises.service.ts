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
  ): Observable<ExercisesEntity[]> {
    return this.afs
      .collection<ExerciseMetaDTO>(
        COLLECTIONS.EXERCISES,
        (ref: CollectionReference) =>
          this.toPaginatedRef({ ref, ...searchOptions }),
      )
      .get()
      .pipe(
        tap(
          (snaps) =>
            (this.exerciseDocCash =
              [...snaps.docs][snaps.docs.length - 1] ?? null),
        ),
        map(convertSnaps),
        tap(console.log),
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

  public loadAllExercises(): Observable<ExercisesEntity[]> {
    return this.afs
      .collection<ExercisesEntity>(
        COLLECTIONS.EXERCISES,
        (ref: CollectionReference) =>
          ref.orderBy(EXERCISE_FIELD_NAMES.RATING, ORDER_BY.DESC),
      )
      .get()
      .pipe(map(convertSnaps), first());
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

  private toPaginatedRef({
    ref,
    sortOrder = ORDER_BY.DESC,
    firstPage = DEFAULT_PAGINATION_STATE.firstPage,
    pageSize = DEFAULT_PAGINATION_STATE.pageSize,
  }: Partial<SearchOptions> & { ref: CollectionReference }) {
    const newRef = ref
      ?.orderBy(
        new firebase.firestore.FieldPath(
          'baseData',
          EXERCISE_FIELD_NAMES.RATING,
        ),
        sortOrder,
      )
      .limit(2);

    return firstPage ? newRef : newRef.startAfter(this.exerciseDocCash);
  }
}
