import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap } from 'rxjs/operators';
import { Observable, EMPTY, of, switchMap } from 'rxjs';

import { loadExerciseDetailsFailure } from '../../../../../../exercises/data/src/lib/+state/exercises.actions';
import { WorkoutActionNames } from '../actions/workout-action-names';
import {
  loadWorkoutDetailsFailure,
  loadWorkoutDetailsSuccess,
  loadWorkoutPreviewsSuccess,
} from '../actions/workouts.actions';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { WorkoutService } from '../../services/workout.service';
import { WorkoutPreview } from '@fitness-tracker/workout/model';
import { SerializedWorkout } from '@fitness-tracker/shared/utils';

@Injectable()
export class WorkoutsEffects {
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
      switchMap(({ payload }) =>
        this.workoutAPI.getWorkout(payload).pipe(
          map((payload: SerializedWorkout) =>
            loadWorkoutDetailsSuccess({ payload }),
          ),
          catchError((error) => of(loadWorkoutDetailsFailure())),
        ),
      ),
    ),
  );

  constructor(
    private readonly actions$: Actions,
    private readonly workoutAPI: WorkoutService,
  ) {}
}
