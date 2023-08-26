import { createReducer, on } from '@ngrx/store';
import { WorkoutDetails } from '../../classes/workout-serializer';
import * as WorkoutsActions from '../actions/workouts.actions';
import { WorkoutPreview } from '../../../workout-preview';

export const workoutsFeatureKey = 'workouts';

export interface WorkoutsState {
  workoutPreviews: WorkoutPreview[];
  workoutDetails: WorkoutDetails | null;
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

  on(WorkoutsActions.deleteWorkoutSuccess, (state, { payload }) => ({
    ...state,
    workoutPreviews: state.workoutPreviews.filter(
      (workout) => workout.id !== payload,
    ),
  })),

  on(WorkoutsActions.navigatedFromWorkoutCompose, (state) => ({
    ...state,
    workoutDetails: null,
  })),
);
