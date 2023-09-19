import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromWorkouts from '../reducers/workouts.reducer';

import { toWorkoutDetailsVm } from '../../VM/to-workout-details-vm';

export const selectWorkoutsState =
  createFeatureSelector<fromWorkouts.WorkoutsState>(
    fromWorkouts.workoutsFeatureKey,
  );

export const selectWorkoutPreviewsVM = createSelector(
  selectWorkoutsState,
  (state) => state.workoutPreviews,
);

export const getAreWorkoutsLoading = createSelector(
  selectWorkoutsState,
  (state) => state.areWorkoutsLoading,
);

export const workoutDetailsVm = createSelector(selectWorkoutsState, (state) =>
  !state.workoutDetails ? null : toWorkoutDetailsVm(state.workoutDetails),
);
