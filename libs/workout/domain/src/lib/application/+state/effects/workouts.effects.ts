import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, withLatestFrom } from 'rxjs/operators';
import { Observable, of, pipe, switchMap, UnaryFunction, filter } from 'rxjs';

import * as WorkoutActions from '../actions/workouts.actions';
import { WorkoutService } from '../../services/workout.service';
import { WorkoutPreview } from '../../../workout-preview';

import { Store } from '@ngrx/store';
import { selectLanguage } from '@fitness-tracker/shared/data-access';

import { WithPayload, WithId } from '@fitness-tracker/shared/utils';
import { selectIsAdmin, selectUserInfo } from '@fitness-tracker/auth/domain';
import { WorkoutDetails } from '../../classes/workout-serializer';
import {
  toIdsFromSerializedWorkout,
  toExercisesMap,
  toWorkoutDetails,
} from '../../utils/mappers';
import {
  FirebaseExerciseDataService,
  GetWorkoutExercisesRequestDto,
} from '@fitness-tracker/exercise/public-api';

@Injectable()
export class WorkoutsEffects {
  public readonly createWorkout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WorkoutActions.createWorkout),
      withLatestFrom(
        this.store.select(selectUserInfo).pipe(filter(Boolean)),
        this.store.select(selectIsAdmin),
      ),
      switchMap(([{ payload }, { uid: userId }, admin]) =>
        this.workoutAPI
          .createWorkout({
            ...payload,
            admin,
            userId: admin ? null : userId,
          })
          .pipe(
            map(() => WorkoutActions.createWorkoutSuccess()),
            catchError((payload) =>
              of(WorkoutActions.createWorkoutFailure({ payload })),
            ),
          ),
      ),
    ),
  );

  public readonly loadWorkouts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WorkoutActions.loadWorkoutPreviews),
      withLatestFrom(
        this.store.select(selectUserInfo).pipe(filter(Boolean)),
        this.store.select(selectIsAdmin),
      ),
      switchMap(([{ payload }, { uid }, isAdmin]) =>
        this.workoutAPI.getWorkoutPreviews(uid, isAdmin, payload).pipe(
          map((payload: WorkoutPreview[]) =>
            WorkoutActions.loadWorkoutPreviewsSuccess({ payload }),
          ),
          catchError((err: unknown) => {
            console.error('error', err);

            return of(WorkoutActions.loadWorkoutPreviewsFailure({ payload }));
          }),
        ),
      ),
    ),
  );

  public readonly loadWorkoutDetails = createEffect(() =>
    this.actions$.pipe(
      ofType(WorkoutActions.loadWorkoutDetails),
      this.getWorkoutDetailsLocalized$(),
      map((payload) => WorkoutActions.loadWorkoutDetailsSuccess({ payload })),
      catchError((payload) => [
        WorkoutActions.loadWorkoutDetailsFailure({ payload }),
      ]),
    ),
  );

  public readonly deleteWorkout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WorkoutActions.deleteWorkout),
      switchMap(({ payload }) =>
        this.workoutAPI.deleteWorkout(payload).pipe(
          map(() => WorkoutActions.deleteWorkoutSuccess({ payload })),
          catchError((payload) =>
            of(WorkoutActions.deleteWorkoutFailure({ payload })),
          ),
        ),
      ),
    ),
  );

  readonly logError$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          WorkoutActions.loadWorkoutPreviewsFailure,
          WorkoutActions.loadWorkoutDetailsFailure,
          WorkoutActions.deleteWorkoutFailure,
          WorkoutActions.createWorkoutFailure,
          WorkoutActions.editWorkoutFailure,
        ),
        map(({ payload }) => console.error(payload)),
      ),
    { dispatch: false },
  );

  constructor(
    private readonly actions$: Actions,
    private readonly store: Store,
    private readonly workoutAPI: WorkoutService,
    private readonly exercisesService: FirebaseExerciseDataService,
  ) {}

  private getWorkoutDetailsLocalized$(): UnaryFunction<
    Observable<WithPayload<string>>,
    Observable<WorkoutDetails>
  > {
    return pipe(
      withLatestFrom(
        this.store.select(selectLanguage),
        this.store.select(selectUserInfo).pipe(filter(Boolean)),
        this.store.select(selectIsAdmin),
      ),
      switchMap(([{ payload }, lang, { uid: userId }, isAdmin]) =>
        this.workoutAPI.getWorkout(payload).pipe(
          map((serializedWorkout) => ({
            serializedWorkout,
            ids: toIdsFromSerializedWorkout(serializedWorkout),
          })),
          switchMap(({ ids, serializedWorkout }) =>
            this.exercisesService
              .findExercisesForWorkout(
                new GetWorkoutExercisesRequestDto(
                  { ids, userId, isAdmin },
                  lang,
                ),
              )
              .pipe(
                map((exercises) => ({
                  exercises: exercises.reduce(
                    toExercisesMap,
                    new Map<string, WithId<unknown>>(),
                  ),
                  serializedWorkout,
                })),
              ),
          ),
          map(toWorkoutDetails),
        ),
      ),
    );
  }
}
