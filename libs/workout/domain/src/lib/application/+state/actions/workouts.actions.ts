import { createAction, props } from '@ngrx/store';
import { WorkoutActionNames } from './workout-action-names';
import { WithPayload } from '@fitness-tracker/shared/utils';
import { WorkoutPreview } from '../../../workout-preview';
import {
  WorkoutDetails,
  SerializedWorkout,
} from '../../classes/workout-serializer';

export const loadWorkoutPreviews = createAction(
  WorkoutActionNames.LOAD_WORKOUT_PREVIEWS,
  props<Partial<WithPayload<WorkoutPreview['targetMuscles']>>>(),
);

export const loadWorkoutPreviewsSuccess = createAction(
  WorkoutActionNames.LOAD_WORKOUT_PREVIEWS_SUCCESS,
  props<WithPayload<WorkoutPreview[]>>(),
);

export const loadWorkoutPreviewsFailure = createAction(
  WorkoutActionNames.LOAD_WORKOUT_DETAILS_FAILURE,
  props<WithPayload<unknown>>(),
);

export const loadWorkoutDetails = createAction(
  WorkoutActionNames.LOAD_WORKOUT_DETAILS,
  props<WithPayload<string>>(),
);

export const loadWorkoutDetailsSuccess = createAction(
  WorkoutActionNames.LOAD_WORKOUT_DETAILS_SUCCESS,
  props<WithPayload<WorkoutDetails>>(),
);

export const loadWorkoutDetailsFailure = createAction(
  WorkoutActionNames.LOAD_WORKOUT_DETAILS_FAILURE,
  props<WithPayload<unknown>>(),
);

export const createWorkout = createAction(
  WorkoutActionNames.CREATE_WORKOUT,
  props<WithPayload<SerializedWorkout>>(),
);

export const createWorkoutSuccess = createAction(
  WorkoutActionNames.CREATE_WORKOUT_SUCCESS,
);

export const createWorkoutFailure = createAction(
  WorkoutActionNames.CREATE_WORKOUT_FAILURE,
  props<WithPayload<unknown>>(),
);

export const editWorkout = createAction(
  WorkoutActionNames.EDIT_WORKOUT,
  props<WithPayload<string>>(),
);

export const editWorkoutSuccess = createAction(
  WorkoutActionNames.EDIT_WORKOUT_SUCCESS,
);

export const editWorkoutFailure = createAction(
  WorkoutActionNames.EDIT_WORKOUT_FAILURE,
  props<WithPayload<unknown>>(),
);

export const deleteWorkout = createAction(
  WorkoutActionNames.DELETE_WORKOUT,
  props<WithPayload<string>>(),
);

export const deleteWorkoutSuccess = createAction(
  WorkoutActionNames.DELETE_WORKOUT_SUCCESS,
  props<WithPayload<string>>(),
);

export const deleteWorkoutFailure = createAction(
  WorkoutActionNames.DELETE_WORKOUT_FAILURE,
  props<WithPayload<unknown>>(),
);

export const navigatedFromWorkoutCompose = createAction(
  WorkoutActionNames.NAVIGATED_FROM_WORKOUT_COMPOSE,
);
