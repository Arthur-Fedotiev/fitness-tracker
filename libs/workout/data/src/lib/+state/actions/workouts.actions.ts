import { createAction, props } from '@ngrx/store';
import { WorkoutActionNames } from './workout-action-names';
import {
  SerializedWorkout,
  WithPayload,
  WorkoutDetails,
} from '@fitness-tracker/shared/utils';
import { WorkoutPreview } from '@fitness-tracker/workout/model';

export const loadWorkoutPreviews = createAction(
  WorkoutActionNames.LOAD_WORKOUT_PREVIEWS,
  props<Partial<WithPayload<WorkoutPreview['muscles']>>>(),
);

export const loadWorkoutPreviewsSuccess = createAction(
  WorkoutActionNames.LOAD_WORKOUT_PREVIEWS_SUCCESS,
  props<WithPayload<WorkoutPreview[]>>(),
);

export const loadWorkoutPreviewsFailure = createAction(
  WorkoutActionNames.LOAD_WORKOUT_DETAILS_FAILURE,
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
);
