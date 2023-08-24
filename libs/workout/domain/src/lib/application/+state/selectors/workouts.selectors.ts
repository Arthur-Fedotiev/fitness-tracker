import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromWorkouts from '../reducers/workouts.reducer';
import { WorkoutPreview } from '@fitness-tracker/workout-domain';
import { SerializedWorkout } from '../../classes/workout-serializer';

export const selectWorkoutsState =
  createFeatureSelector<fromWorkouts.WorkoutsState>(
    fromWorkouts.workoutsFeatureKey,
  );

export const workoutPreviews = createSelector(
  selectWorkoutsState,
  (state): WorkoutPreview[] => state.workoutPreviews,
);

export const workoutDetails = createSelector(
  selectWorkoutsState,
  (state): SerializedWorkout | null => state.workoutDetails,
);
