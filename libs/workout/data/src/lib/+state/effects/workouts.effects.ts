import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, withLatestFrom } from 'rxjs/operators';
import { of, switchMap } from 'rxjs';

import { WorkoutActionNames } from '../actions/workout-action-names';
import {
  createWorkoutFailure,
  createWorkoutSuccess,
  loadWorkoutDetailsFailure,
  loadWorkoutDetailsSuccess,
  loadWorkoutPreviewsSuccess,
} from '../actions/workouts.actions';
import { WorkoutService } from '../../services/workout.service';
import { WorkoutPreview } from '@fitness-tracker/workout/model';
import {
  SerializedWorkout,
  toExercisesMap,
  toIdsFromSerializedWorkout,
  toWorkoutDetails,
  WithPayload,
  WorkoutDetails,
} from '@fitness-tracker/shared/utils';
import { Store } from '@ngrx/store';
import { selectLanguage } from '@fitness-tracker/shared/data-access';
import {
  ExercisesService,
  loadExerciseDetailsFailure,
} from '@fitness-tracker/exercises/data';
import { ExercisesEntity } from '@fitness-tracker/exercises/model';

@Injectable()
export class WorkoutsEffects {
  public readonly createWorkout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WorkoutActionNames.CREATE_WORKOUT),
      switchMap(({ payload }: WithPayload<SerializedWorkout>) =>
        this.workoutAPI.createWorkout(payload).pipe(
          map((payload) => createWorkoutSuccess()),
          catchError((error) => of(createWorkoutFailure())),
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
            loadWorkoutPreviewsSuccess({ payload }),
          ),
          catchError((error) => of(loadExerciseDetailsFailure())),
        ),
      ),
    ),
  );

  public readonly loadWorkoutDetails = createEffect(() =>
    this.actions$.pipe(
      ofType(WorkoutActionNames.LOAD_WORKOUT_DETAILS),
      withLatestFrom(this.store.select(selectLanguage)),
      switchMap(([{ payload }, lang]) =>
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
              this.exercisesService.findExercises({ ids }, lang).pipe(
                map((exercises: ExercisesEntity[]) => ({
                  exercises: exercises.reduce(
                    toExercisesMap,
                    new Map<string, ExercisesEntity>(),
                  ),
                  serializedWorkout,
                })),
              ),
          ),
          map(toWorkoutDetails),
          map((payload: WorkoutDetails) =>
            loadWorkoutDetailsSuccess({ payload }),
          ),
          catchError(() => of(loadWorkoutDetailsFailure())),
        ),
      ),
    ),
  );

  constructor(
    private readonly actions$: Actions,
    private readonly store: Store,
    private readonly workoutAPI: WorkoutService,
    private readonly exercisesService: ExercisesService,
  ) {}
}
