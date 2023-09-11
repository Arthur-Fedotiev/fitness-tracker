import { Injectable, inject } from '@angular/core';
import {
  DocumentReference,
  CollectionReference,
  QueryDocumentSnapshot,
  FieldPath,
  Firestore,
  QuerySnapshot,
  addDoc,
  collection,
  deleteDoc,
  doc,
  documentId,
  endAt,
  getDoc,
  getDocs,
  limit,
  or,
  query,
  setDoc,
  startAfter,
  where,
} from '@angular/fire/firestore';

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
import { COLLECTIONS, LanguageCodes, Translations } from 'shared-package';

import { ExerciseResponseDto } from '../entities/response/exercise-response';
import {
  convertOneSnap,
  convertSnaps,
  Pagination,
  WithId,
} from '@fitness-tracker/shared/utils';
import { ExerciseResponseModel } from '../application/models/exercise-response.model';
import { CreateUpdateExerciseRequestDTO } from '../entities/dto/request/update/exercise-create-update-request.dto';
import { EXERCISE_FIELD_NAMES } from '../entities/exercise.enums';
import {
  ExerciseSearchType,
  GetExerciseRequest,
  GetExerciseRequestDto,
  GetWorkoutExercisesRequestDto,
  SearchOptionsDto,
} from '../entities/dto/request/get/get-exercise-request.dto';
import { LanguagesISO } from '@fitness-tracker/shared/i18n/utils';
import { chunk } from 'lodash-es';

export type ExerciseCollection = CollectionReference<ExerciseResponseDto>;

@Injectable({
  providedIn: 'root',
})
export class FirebaseExerciseDataService {
  private readonly firestore = inject(Firestore);
  private readonly exerciseCollectionRef = collection(
    this.firestore,
    COLLECTIONS.EXERCISES,
  ) as ExerciseCollection;

  private exerciseDocCash: QueryDocumentSnapshot<ExerciseResponseDto> | null =
    null;

  public createOrUpdateExercise(
    exercise: CreateUpdateExerciseRequestDTO,
  ): Observable<void | DocumentReference<ExerciseResponseDto>> {
    const id = exercise.baseData.id;

    const handler = id
      ? setDoc(doc(this.exerciseCollectionRef, id), exercise)
      : addDoc(this.exerciseCollectionRef, exercise);

    return from(handler).pipe(first());
  }

  public findExercisesForWorkout({
    searchOptions: { ids, ...restSearchOptions },
    lang,
  }: GetWorkoutExercisesRequestDto): Observable<ExerciseResponseModel[]> {
    return forkJoin(
      chunk(ids, 10).map((ids) =>
        this.findExercisesPaginated(
          new GetWorkoutExercisesRequestDto(
            { ids, ...restSearchOptions },
            lang,
          ),
        ),
      ),
    ).pipe(map((exercises) => exercises.flat()));
  }

  public findExercisesPaginated(req: GetExerciseRequest) {
    const query =
      req.type === ExerciseSearchType.WorkoutExerciseSearch
        ? this.toRefOfWorkoutList(
            this.exerciseCollectionRef,
            req.searchOptions.ids,
          )
        : this.toExerciseSearchRef(this.exerciseCollectionRef, req);

    return from(getDocs<ExerciseResponseDto>(query)).pipe(
      tap(
        (snaps: QuerySnapshot<ExerciseResponseDto>) =>
          (this.exerciseDocCash =
            [...snaps.docs][snaps.docs.length - 1] ?? null),
      ),
      map((exerciseResponseSnaps) =>
        convertSnaps<ExerciseResponseDto>(exerciseResponseSnaps),
      ),
      map((exerciseResponseList: WithId<ExerciseResponseDto>[]) =>
        exerciseResponseList.map(this.toBaseDataWithId),
      ),
      switchMap((exercisesBaseData) => {
        const exercisesTranslationsObs = exercisesBaseData.map(
          this.toExerciseTranslation$(req.lang),
        );

        return exercisesBaseData?.length
          ? combineLatest(exercisesTranslationsObs)
          : of([]);
      }),
      map((translatedExercises) =>
        translatedExercises.map(
          (translatedExercise: any) =>
            new ExerciseResponseModel(translatedExercise),
        ),
      ),
      first(),
    );
  }

  public deleteExercise(exerciseId: string) {
    return from(deleteDoc(doc(this.exerciseCollectionRef, exerciseId)));
  }

  public getExerciseDetails(
    exerciseId: string,
    lang: LanguageCodes = LanguagesISO.ENGLISH,
  ): Observable<ExerciseResponseModel> {
    return from(getDoc(doc(this.exerciseCollectionRef, exerciseId))).pipe(
      map((exercise) => convertOneSnap<WithId<ExerciseResponseDto>>(exercise)),
      map(this.toBaseDataWithId),
      switchMap((exercise) => this.toExerciseTranslation$(lang)(exercise)),
      map(
        (translatedExercise: any) =>
          new ExerciseResponseModel(translatedExercise),
      ),
    );
  }

  private toExerciseSearchRef(
    ref: ExerciseCollection,
    dto: GetExerciseRequestDto,
  ) {
    return dto.refresh
      ? this.toRefreshRef(ref, dto.searchOptions)
      : this.toPaginatedRef(ref, dto.searchOptions);
  }

  private toPaginatedRef(
    ref: ExerciseCollection,
    searchOptions: SearchOptionsDto & Required<Pagination>,
  ) {
    const newRef = query(
      this.getExerciseCollectionRef(ref, searchOptions),
      limit(searchOptions.pageSize),
    );

    return searchOptions.firstPage
      ? newRef
      : query(newRef, startAfter(this.exerciseDocCash));
  }

  private toRefreshRef(
    ref: ExerciseCollection,
    searchOptions: SearchOptionsDto,
  ) {
    return query(
      this.getExerciseCollectionRef(ref, searchOptions),
      endAt(this.exerciseDocCash),
    );
  }

  private getExerciseCollectionRef(
    ref: ExerciseCollection,
    searchOptions: SearchOptionsDto,
  ) {
    const filteredRef = searchOptions.targetMuscles?.length
      ? query(
          ref,
          where(
            new FieldPath('baseData', EXERCISE_FIELD_NAMES.TARGET_MUSCLE),
            'in',
            searchOptions.targetMuscles,
          ),
        )
      : ref;

    return query(
      filteredRef,
      or(
        where(
          new FieldPath('baseData', EXERCISE_FIELD_NAMES.USER_ID),
          '==',
          searchOptions.userId,
        ),
        where(
          new FieldPath('baseData', EXERCISE_FIELD_NAMES.USER_ID),
          '==',
          null,
        ),
      ),
    );
  }

  private toRefOfWorkoutList(ref: ExerciseCollection, ids: string[]) {
    return query<ExerciseResponseDto>(ref, where(documentId(), 'in', ids));
  }

  private toExerciseTranslation$<T extends { id: string }>(
    lang: LanguageCodes,
  ) {
    return (exercise: T) =>
      from(
        getDoc(
          doc(
            this.exerciseCollectionRef,
            exercise.id,
            COLLECTIONS.TRANSLATIONS,
            lang,
          ),
        ),
      ).pipe(
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
  }: WithId<ExerciseResponseDto>): WithId<ExerciseResponseDto['baseData']> {
    return { ...baseData, id };
  }
}
