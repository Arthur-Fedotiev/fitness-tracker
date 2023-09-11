import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, withLatestFrom } from 'rxjs/operators';
import { Observable, of, pipe, switchMap, UnaryFunction, filter } from 'rxjs';

import { WorkoutActionNames } from '../actions/workout-action-names';
import * as WorkoutActions from '../actions/workouts.actions';
import { WorkoutService } from '../../services/workout.service';
import { WorkoutPreview } from '../../../workout-preview';

import { Store } from '@ngrx/store';
import { selectLanguage } from '@fitness-tracker/shared/data-access';

import { LanguageCodes } from 'shared-package';
import { WithPayload } from '@fitness-tracker/shared/utils';
import { selectIsAdmin, selectUserInfo } from '@fitness-tracker/auth/domain';
import {
  SerializedWorkout,
  WorkoutDetails,
} from '../../classes/workout-serializer';
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
            catchError(() => of(WorkoutActions.createWorkoutFailure())),
          ),
      ),
    ),
  );

  public readonly loadWorkouts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WorkoutActionNames.LOAD_WORKOUT_PREVIEWS),
      switchMap(({ payload }) =>
        this.workoutAPI.getWorkoutPreviews(payload).pipe(
          map((payload: WorkoutPreview[]) =>
            WorkoutActions.loadWorkoutPreviewsSuccess({ payload }),
          ),
          catchError(() => of(WorkoutActions.loadWorkoutPreviewsFailure())),
        ),
      ),
    ),
  );

  public readonly loadWorkoutDetails = createEffect(() =>
    this.actions$.pipe(
      ofType(WorkoutActionNames.LOAD_WORKOUT_DETAILS),
      this.getWorkoutDetailsLocalized$(),
      map((payload: WorkoutDetails) =>
        WorkoutActions.loadWorkoutDetailsSuccess({ payload }),
      ),
      catchError(() => [WorkoutActions.loadWorkoutDetailsFailure()]),
    ),
  );

  public readonly deleteWorkout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WorkoutActionNames.DELETE_WORKOUT),
      switchMap(({ payload }: { payload: string }) =>
        this.workoutAPI.deleteWorkout(payload).pipe(
          map(() => WorkoutActions.deleteWorkoutSuccess({ payload })),
          catchError(() => of(WorkoutActions.deleteWorkoutFailure())),
        ),
      ),
    ),
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
      withLatestFrom(this.store.select(selectLanguage)),
      switchMap(([{ payload }, lang]: [WithPayload<string>, LanguageCodes]) =>
        this.workoutAPI.getWorkout(payload).pipe(
          map((serializedWorkout) => ({
            serializedWorkout,
            ids: toIdsFromSerializedWorkout(serializedWorkout),
          })),
          switchMap(
            ({
              ids,
              serializedWorkout,
            }: {
              ids: string[];
              serializedWorkout: SerializedWorkout;
            }) =>
              this.exercisesService
                .findExercisesForWorkout(
                  new GetWorkoutExercisesRequestDto({ ids }, lang),
                )
                .pipe(
                  map((exercises: any[]) => ({
                    exercises: exercises.reduce(
                      toExercisesMap,
                      new Map<string, any>(),
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
