import { EnvironmentInjector, inject, Injectable, runInInjectionContext } from '@angular/core';
import {
  addDoc,
  and,
  collection,
  CollectionReference,
  deleteDoc,
  doc,
  documentId,
  DocumentReference,
  endAt,
  FieldPath,
  Firestore,
  getDoc,
  getDocs,
  limit,
  or,
  query,
  QueryDocumentSnapshot,
  QuerySnapshot,
  setDoc,
  startAfter,
  where,
} from '@angular/fire/firestore';

import { first, forkJoin, from, map, Observable, tap } from 'rxjs';
import { COLLECTIONS } from 'shared-package';

import { convertOneSnap, convertSnaps, Pagination, WithId } from '@fitness-tracker/shared/utils';
import { chunk } from 'lodash-es';
import { ExerciseResponseModel } from '../application/models/exercise-response.model';
import {
  ExerciseSearchType,
  GetExerciseRequest,
  GetExerciseRequestDto,
  GetWorkoutExercisesRequestDto,
  SearchOptionsDto,
  WorkoutExercisesSearchOptions,
} from '../entities/dto/request/get/get-exercise-request.dto';
import { CreateUpdateExerciseRequestDTO } from '../entities/dto/request/update/exercise-create-update-request.dto';
import { EXERCISE_FIELD_NAMES } from '../entities/exercise.enums';
import { ExerciseResponseDto } from '../entities/response/exercise-response';

export type ExerciseCollection = CollectionReference<ExerciseResponseDto>;

@Injectable({
  providedIn: 'root',
})
export class FirebaseExerciseDataService {
  private readonly injector = inject(EnvironmentInjector);
  private readonly firestore = inject(Firestore);
  private readonly exerciseCollectionRef = collection(this.firestore, COLLECTIONS.EXERCISES) as ExerciseCollection;

  private exerciseDocCash: QueryDocumentSnapshot<ExerciseResponseDto> | null = null;

  createOrUpdateExercise({
    id,
    ...exercise
  }: CreateUpdateExerciseRequestDTO): Observable<void | DocumentReference<ExerciseResponseDto>> {
    const handler = id
      ? setDoc(doc(this.exerciseCollectionRef, id), exercise)
      : addDoc(this.exerciseCollectionRef, exercise);

    return from(handler).pipe(first());
  }

  findExercisesForWorkout({
    searchOptions: { ids, ...restSearchOptions },
  }: GetWorkoutExercisesRequestDto): Observable<ExerciseResponseModel[]> {
    return forkJoin(
      chunk(ids, 10).map((ids) =>
        this.findExercisesPaginated(new GetWorkoutExercisesRequestDto({ ids, ...restSearchOptions })),
      ),
    ).pipe(map((exercises) => exercises.flat()));
  }

  findExercisesPaginated(req: GetExerciseRequest) {
    const query =
      req.type === ExerciseSearchType.WorkoutExerciseSearch
        ? this.toRefOfWorkoutList(this.exerciseCollectionRef, req.searchOptions)
        : this.toExerciseSearchRef(this.exerciseCollectionRef, req);

    return from(runInInjectionContext(this.injector, () => getDocs<ExerciseResponseDto, any>(query))).pipe(
      tap(
        (snaps: QuerySnapshot<ExerciseResponseDto>) =>
          (this.exerciseDocCash = [...snaps.docs][snaps.docs.length - 1] ?? null),
      ),
      map((exerciseResponseSnaps) => convertSnaps<ExerciseResponseDto>(exerciseResponseSnaps)),
      map((exerciseResponseList: Array<WithId<ExerciseResponseDto>>) =>
        exerciseResponseList.map(this.toBaseDataWithId).map((exercise) => new ExerciseResponseModel(exercise)),
      ),
      first(),
    );
  }

  deleteExercise(exerciseId: string) {
    return from(deleteDoc(doc(this.exerciseCollectionRef, exerciseId)));
  }

  getExerciseDetails(exerciseId: string) {
    return from(getDoc(doc(this.exerciseCollectionRef, exerciseId))).pipe(
      map(convertOneSnap),
      map(this.toBaseDataWithId),
      map((exercise) => new ExerciseResponseModel(exercise)),
    );
  }

  private toExerciseSearchRef(ref: ExerciseCollection, dto: GetExerciseRequestDto) {
    return dto.refresh ? this.toRefreshRef(ref, dto.searchOptions) : this.toPaginatedRef(ref, dto.searchOptions);
  }

  private toPaginatedRef(ref: ExerciseCollection, searchOptions: SearchOptionsDto & Required<Pagination>) {
    const newRef = query(this.getExerciseCollectionRef(ref, searchOptions), limit(searchOptions.pageSize));

    return searchOptions.firstPage ? newRef : query(newRef, startAfter(this.exerciseDocCash));
  }

  private toRefreshRef(ref: ExerciseCollection, searchOptions: SearchOptionsDto) {
    return query(this.getExerciseCollectionRef(ref, searchOptions), endAt(this.exerciseDocCash));
  }

  private getExerciseCollectionRef(ref: ExerciseCollection, searchOptions: SearchOptionsDto) {
    const queryWithOwnership = searchOptions.isAdmin
      ? query(ref, where(new FieldPath('baseData', EXERCISE_FIELD_NAMES.ADMIN), '==', true))
      : query(
          ref,
          or(
            where(new FieldPath('baseData', EXERCISE_FIELD_NAMES.USER_ID), '==', searchOptions.userId),
            where(new FieldPath('baseData', EXERCISE_FIELD_NAMES.ADMIN), '==', true),
          ),
        );

    return searchOptions.targetMuscles?.length
      ? query(
          queryWithOwnership,
          where(new FieldPath('baseData', EXERCISE_FIELD_NAMES.TARGET_MUSCLE), 'in', searchOptions.targetMuscles),
        )
      : queryWithOwnership;
  }

  private toRefOfWorkoutList(ref: ExerciseCollection, { ids, isAdmin, userId }: WorkoutExercisesSearchOptions) {
    return query(
      ref,
      and(
        where(documentId(), 'in', ids),
        ...(isAdmin
          ? [where(new FieldPath('baseData', EXERCISE_FIELD_NAMES.ADMIN), '==', true)]
          : [
              where(new FieldPath('baseData', EXERCISE_FIELD_NAMES.USER_ID), '==', userId),
              where(new FieldPath('baseData', EXERCISE_FIELD_NAMES.ADMIN), '==', true),
            ]),
      ),
    );
  }

  private toBaseDataWithId({ baseData, id }: WithId<ExerciseResponseDto>) {
    return { ...baseData, id };
  }
}
