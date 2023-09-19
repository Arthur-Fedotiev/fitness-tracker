import { createReducer, on } from '@ngrx/store';
import { WorkoutDetails } from '../../classes/workout-serializer';
import * as WorkoutsActions from '../actions/workouts.actions';
import { WorkoutPreview } from '../../../workout-preview';

export const workoutsFeatureKey = 'workouts';

export interface WorkoutsState {
  workoutPreviews: WorkoutPreview[];
  workoutDetails: WorkoutDetails | null;
  areWorkoutsLoading: boolean;
}

export const initialState: WorkoutsState = {
  workoutPreviews: [],
  workoutDetails: null,
  areWorkoutsLoading: false,
};

export const reducer = createReducer(
  initialState,

  on(WorkoutsActions.loadWorkoutPreviews, (state) => ({
    ...state,
    areWorkoutsLoading: true,
  })),

  on(WorkoutsActions.loadWorkoutPreviewsSuccess, (state, { payload }) => ({
    ...state,
    workoutPreviews: payload,
    areWorkoutsLoading: false,
  })),

  on(WorkoutsActions.loadWorkoutPreviewsFailure, (state) => ({
    ...state,
    areWorkoutsLoading: false,
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

  on(WorkoutsActions.navigatedFromWorkoutDisplay, (state) => ({
    ...state,
    workoutPreviews: [],
  })),
);
