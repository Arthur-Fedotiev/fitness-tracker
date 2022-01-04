import { SerializedWorkout } from '@fitness-tracker/shared/utils';
import { WorkoutPreview } from '@fitness-tracker/workout/model';
import { createReducer, on } from '@ngrx/store';
import * as WorkoutsActions from '../actions/workouts.actions';

export const workoutsFeatureKey = 'workouts';

export interface WorkoutsState {
  workoutPreviews: WorkoutPreview[];
  workoutDetails: SerializedWorkout | null;
}

export const initialState: WorkoutsState = {
  workoutPreviews: [],
  workoutDetails: null,
};

export const reducer = createReducer(
  initialState,

  on(WorkoutsActions.loadWorkoutPreviewsSuccess, (state, { payload }) => ({
    ...state,
    workoutPreviews: payload,
  })),

  on(WorkoutsActions.loadWorkoutDetailsSuccess, (state, { payload }) => ({
    ...state,
    workoutDetails: payload,
  })),
);
