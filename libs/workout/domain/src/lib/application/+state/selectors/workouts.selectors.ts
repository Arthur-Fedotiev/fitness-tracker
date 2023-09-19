import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromWorkouts from '../reducers/workouts.reducer';

export const selectWorkoutsState =
  createFeatureSelector<fromWorkouts.WorkoutsState>(
    fromWorkouts.workoutsFeatureKey,
  );

export const selectWorkoutPreviewsVM = createSelector(
  selectWorkoutsState,
  (state) => state.workoutPreviews,
);

export const workoutDetails = createSelector(
  selectWorkoutsState,
  (state) => state.workoutDetails,
);

export const getAreWorkoutsLoading = createSelector(
  selectWorkoutsState,
  (state) => state.areWorkoutsLoading,
);
