import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  DocumentReference,
} from '@angular/fire/compat/firestore';
import {
  Exercise,
  ExerciseBaseData,
  ExerciseMetaDTO,
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
import { COLLECTIONS, Translations, LanguageCodes } from 'shared-package';

@Injectable({
  providedIn: 'root',
})
export class ExercisesService {
  private exerciseDocCash: QueryDocumentSnapshot<ExerciseMetaDTO> | null = null;

  constructor(private readonly afs: AngularFirestore) {}

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

  public updateExercise({ id, ...exercise }: Partial<ExercisesEntity>) {
    return from(
      this.afs.doc(`${COLLECTIONS.EXERCISES}/${id}`).update(exercise),
    );
  }

  public findExercises(
    searchOptions: Partial<SearchOptions>,
    lang: LanguageCodes = 'ru',
  ): any {
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
          exercises.map(
            ({
              baseData,
              id,
            }: WithId<ExerciseMetaDTO>): Required<ExerciseBaseData> => ({
              ...baseData,
              id,
            }),
          ),
        ),
        switchMap((exercisesBaseData: Required<ExerciseBaseData>[]) => {
          const exercisesTranslations = exercisesBaseData.map((exercise) =>
            this.afs
              .doc<Translations<Exercise>[typeof lang]>(
                `${COLLECTIONS.EXERCISES}/${exercise.id}/${COLLECTIONS.TRANSLATIONS}/${lang}`,
              )
              .get()
              .pipe(
                tap(console.log),
                map(convertOneSnap),
                map((translation: Translations<any>[typeof lang]) => ({
                  ...translation,
                  ...exercise,
                })),
                first(),
              ),
          );

          return combineLatest(exercisesTranslations);
        }),
        first(),
      );
  }

  // public createExercise2(
  //   exercise: Exercise,
  //   exerciseId?: string,
  // ): Observable<void | DocumentReference<Exercise>> {
  //   return exerciseId
  //     ? from(
  //         this.afs
  //           .doc<Exercise>(`${COLLECTIONS.EXERCISES}/${exerciseId}`)
  //           .set(exercise),
  //       ).pipe(first())
  //     : from(
  //         this.afs
  //           .collection<Exercise>(`${COLLECTIONS.EXERCISES}`)
  //           .add(exercise),
  //       ).pipe(first());
  // }

  // public updateExercise2({ id, ...exercise }: Partial<ExercisesEntity>) {
  //   return from(
  //     this.afs.doc(`${COLLECTIONS.EXERCISES}/${id}`).update(exercise),
  //   );
  // }

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

  // public findExercises2(
  //   searchOptions: Partial<SearchOptions>,
  // ): Observable<ExercisesEntity[]> {
  //   return this.afs
  //     .collection<ExercisesEntity>(
  //       COLLECTIONS.EXERCISES,
  //       (ref: CollectionReference) =>
  //         this.toPaginatedRef({ ref, ...searchOptions }),
  //     )
  //     .get()
  //     .pipe(
  //       tap(
  //         (snaps) =>
  //           (this.exerciseDocCash =
  //             [...snaps.docs][snaps.docs.length - 1] ?? null),
  //       ),
  //       map(convertSnaps),
  //       first(),
  //     );
  // }

  public getExerciseDetails(exerciseId: string): Observable<ExercisesEntity> {
    return this.afs
      .doc<ExercisesEntity>(`${COLLECTIONS.EXERCISES}/${exerciseId}`)
      .get()
      .pipe(
        map<
          firebase.firestore.DocumentSnapshot<ExercisesEntity>,
          ExercisesEntity
        >(convertOneSnap),
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
