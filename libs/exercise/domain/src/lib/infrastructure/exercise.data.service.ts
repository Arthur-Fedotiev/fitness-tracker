import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  DocumentReference,
} from '@angular/fire/compat/firestore';

import { FieldPath, documentId } from 'firebase/firestore';
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
import { COLLECTIONS, LanguageCodes, Translations } from 'shared-package';

import { ExerciseResponse } from '../entities/response/exercise-response';
import {
  convertOneSnap,
  convertSnaps,
  DEFAULT_PAGINATION_STATE,
  LanguagesISO,
  ORDER_BY,
  WithId,
} from '@fitness-tracker/shared/utils';
import { ExerciseResponseDto } from '../entities/dto/response/exercise-response.dto';
import { UpdateExerciseRequestDTO } from '../entities/dto/request/update/exercise-update-request.dto';
import { CreateExerciseRequestDto } from '../entities/dto/request/create/create-exercise-request.dto';
import { EXERCISE_FIELD_NAMES } from '../entities/exercise.enums';
import { GetExerciseRequestDto } from '../entities/dto/request/get/get-exercise-request.dto';

@Injectable({
  providedIn: 'root',
})
export class FirebaseExerciseDataService {
  private exerciseDocCash: QueryDocumentSnapshot<ExerciseResponse> | null =
    null;

  constructor(public readonly afs: AngularFirestore) {}

  public createExercise(
    exercise: CreateExerciseRequestDto,
  ): Observable<void | DocumentReference<CreateExerciseRequestDto>> {
    const id = exercise.baseData.id;
    return id
      ? from(
          this.afs
            .doc<CreateExerciseRequestDto>(`${COLLECTIONS.EXERCISES}/${id}`)
            .set(exercise),
        ).pipe(first())
      : from(
          this.afs
            .collection<CreateExerciseRequestDto>(`${COLLECTIONS.EXERCISES}`)
            .add(exercise),
        ).pipe(first());
  }

  public updateExercise(exercise: UpdateExerciseRequestDTO) {
    return from(
      this.afs
        .doc(`${COLLECTIONS.EXERCISES}/${exercise?.baseData?.id}`)
        .update(exercise),
    );
  }

  public findExercisesForWorkout({
    searchOptions: { ids, ...restSearchOptions },
    lang,
    refresh,
  }: GetExerciseRequestDto): Observable<ExerciseResponseDto[]> {
    if (ids && !this.shouldSplitToChunks(ids)) {
      return this.findExercises(
        new GetExerciseRequestDto({ ids, ...restSearchOptions }, lang, refresh),
      );
    }
    const clonedIds = Array.from(ids as any[]);
    // TODO: implement robust solution in case there will be more than 20 items in workout

    // INFO: This solution works on ly for <20 exercises in workout
    const chunk = clonedIds?.splice(0, 10);

    const result$ = forkJoin([
      this.findExercises(
        new GetExerciseRequestDto(
          { ids: chunk, ...restSearchOptions },
          lang,
          refresh,
        ),
      ),
      this.findExercisesForWorkout(
        new GetExerciseRequestDto(
          { ids: clonedIds, ...restSearchOptions },
          lang,
          refresh,
        ),
      ),
    ]).pipe(map((exercises) => exercises.flat()));

    return result$;
  }

  public findExercises({
    searchOptions,
    lang,
    refresh,
  }: GetExerciseRequestDto): Observable<ExerciseResponseDto[]> {
    return this.afs
      .collection<ExerciseResponse>(
        COLLECTIONS.EXERCISES,
        (ref: CollectionReference) =>
          searchOptions.ids?.length
            ? this.toRefOfWorkoutList({ ref, ...searchOptions })
            : refresh
            ? this.toRefreshRef({ ref, ...searchOptions })
            : this.toPaginatedRef({ ref, ...searchOptions }),
      )
      .get()
      .pipe(
        tap(
          (snaps) =>
            (this.exerciseDocCash =
              [...snaps.docs][snaps.docs.length - 1] ?? null),
        ),
        map((exerciseResponseSnaps) =>
          convertSnaps<ExerciseResponse>(exerciseResponseSnaps),
        ),
        map((exerciseResponseList: WithId<ExerciseResponse>[]) =>
          exerciseResponseList.map(this.toBaseDataWithId),
        ),
        switchMap((exercisesBaseData) => {
          const exercisesTranslationsObs = exercisesBaseData.map(
            this.toExerciseTranslation$(lang),
          );

          return exercisesBaseData?.length
            ? combineLatest(exercisesTranslationsObs)
            : of([]);
        }),
        map((translatedExercises) =>
          translatedExercises.map(
            (translatedExercise: any) =>
              new ExerciseResponseDto(translatedExercise),
          ),
        ),
        first(),
      );
  }

  public deleteExercise(exerciseId: string): Observable<void> {
    return from(
      this.afs.doc(`${COLLECTIONS.EXERCISES}/${exerciseId}`).delete(),
    );
  }

  public getExerciseDetails(
    exerciseId: string,
    lang: LanguageCodes = LanguagesISO.ENGLISH,
  ): Observable<ExerciseResponseDto> {
    return this.afs
      .doc<ExerciseResponse>(`${COLLECTIONS.EXERCISES}/${exerciseId}`)
      .get()
      .pipe(
        map((exercise) => convertOneSnap<WithId<ExerciseResponse>>(exercise)),
        map(this.toBaseDataWithId),
        switchMap((exercise) => this.toExerciseTranslation$(lang)(exercise)),
        map(
          (translatedExercise: any) =>
            new ExerciseResponseDto(translatedExercise),
        ),
      );
  }

  private toPaginatedRef({
    ref,
    targetMuscles,
    sortOrder = ORDER_BY.DESC,
    firstPage = DEFAULT_PAGINATION_STATE.firstPage,
    pageSize = DEFAULT_PAGINATION_STATE.pageSize,
  }: GetExerciseRequestDto['searchOptions'] & { ref: CollectionReference }) {
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
  }: GetExerciseRequestDto['searchOptions'] & { ref: CollectionReference }) {
    return this.getExerciseCollectionRef({
      ref,
      sortOrder,
      targetMuscles,
    }).endAt(this.exerciseDocCash);
  }

  private getExerciseCollectionRef({
    ref,
    targetMuscles,
  }: GetExerciseRequestDto['searchOptions'] & { ref: CollectionReference }) {
    const filteredRef = targetMuscles?.length
      ? ref.where(
          new FieldPath('baseData', EXERCISE_FIELD_NAMES.TARGET_MUSCLE),
          'in',
          targetMuscles,
        )
      : ref;

    return filteredRef;
  }

  private toRefOfWorkoutList({
    ref,
    ids,
  }: GetExerciseRequestDto['searchOptions'] & { ref: CollectionReference }) {
    return ref.where(documentId(), 'in', ids);
  }

  private toExerciseTranslation$<T extends { id: string }>(
    lang: LanguageCodes,
  ) {
    return (exercise: T) =>
      this.afs
        .doc<Translations<T>[typeof lang]>(
          `${COLLECTIONS.EXERCISES}/${exercise.id}/${COLLECTIONS.TRANSLATIONS}/${lang}`,
        )
        .get()
        .pipe(
          map((exercise) => convertOneSnap<T>(exercise)),
          map(
            (
              translation: Translations<
                Translations<T>[typeof lang]
              >[typeof lang],
            ) => ({
              ...translation,
              ...exercise,
            }),
          ),
          first(),
        );
  }

  private toBaseDataWithId({
    baseData,
    id,
  }: WithId<ExerciseResponse>): WithId<ExerciseResponse['baseData']> {
    return { ...baseData, id };
  }

  private shouldSplitToChunks(ids: string[]): boolean {
    return ids?.length > 10;
  }
}
