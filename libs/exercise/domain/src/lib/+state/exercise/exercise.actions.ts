import { WithPayload } from '@fitness-tracker/shared/utils';
import { createAction, props } from '@ngrx/store';
import { GetExerciseRequestDto } from '../../entities/dto/request/get/get-exercise-request.dto';
import { CreateUpdateExerciseRequestDTO } from '../../entities/dto/request/update/exercise-create-update-request.dto';
import { ExerciseResponseDto } from '../../entities/dto/response/exercise-response.dto';
import { EXERCISES_ACTION_NAMES } from './exercise.actions.enum';

export const init = createAction('[Exercises Page] Init');

export const loadExercises = createAction(
  EXERCISES_ACTION_NAMES.LOAD_EXERCISES,
);

export const loadExercisesSuccess = createAction(
  EXERCISES_ACTION_NAMES.LOAD_EXERCISES_SUCCESS,
  props<{ exercises: ExerciseResponseDto[] }>(),
);

export const loadExercisesFailure = createAction(
  EXERCISES_ACTION_NAMES.LOAD_EXERCISES_FAILURE,
  props<{ error: any }>(),
);

export const findExercises = createAction(
  EXERCISES_ACTION_NAMES.FIND_EXERCISES,
  props<WithPayload<GetExerciseRequestDto['searchOptions']>>(),
);

export const findExercisesSuccess = createAction(
  EXERCISES_ACTION_NAMES.FIND_EXERCISES_SUCCESS,
  props<
    WithPayload<{ exercises: ExerciseResponseDto[]; firstPage: boolean }>
  >(),
);

export const findExercisesFailure = createAction(
  EXERCISES_ACTION_NAMES.FIND_EXERCISES_FAILURE,
);

export const refreshExercises = createAction(
  EXERCISES_ACTION_NAMES.REFRESH_EXERCISES,
  props<WithPayload<GetExerciseRequestDto['searchOptions']>>(),
);

export const refreshExercisesSuccess = createAction(
  EXERCISES_ACTION_NAMES.REFRESH_EXERCISES_SUCCESS,
  props<WithPayload<ExerciseResponseDto[]>>(),
);

export const refreshExercisesFailure = createAction(
  EXERCISES_ACTION_NAMES.FIND_EXERCISES_FAILURE,
);

export const emptyExercisesList = createAction(
  EXERCISES_ACTION_NAMES.REFRESH_EXERCISES_FAILURE,
);

// export const createExercise = createAction(
//   EXERCISES_ACTION_NAMES.CREATE_EXERCISE,
//   props<WithPayload<ExerciseResponseDto>>(),
// );

// export const createExerciseMeta = createAction(
//   EXERCISES_ACTION_NAMES.CREATE_EXERCISE,
//   props<WithPayload<CreateUpdateExerciseRequestDTO>>(),
// );

// export const createExerciseSuccess = createAction(
//   EXERCISES_ACTION_NAMES.CREATE_EXERCISE_SUCCESS,
// );

// export const createExerciseFailure = createAction(
//   EXERCISES_ACTION_NAMES.CREATE_EXERCISE_FAILURE,
//   props<WithPayload<string>>(),
// );

// export const updateExercise = createAction(
//   EXERCISES_ACTION_NAMES.UPDATE_EXERCISE,
//   props<WithPayload<CreateUpdateExerciseRequestDTO>>(),
// );

// export const updateExerciseSuccess = createAction(
//   EXERCISES_ACTION_NAMES.UPDATE_EXERCISE_SUCCESS,
// );

// export const updateExerciseFailure = createAction(
//   EXERCISES_ACTION_NAMES.LOAD_EXERCISES,
// );

export const exerciseSaved = createAction(
  EXERCISES_ACTION_NAMES.EXERCISE_SAVED,
  props<WithPayload<CreateUpdateExerciseRequestDTO>>(),
);

export const exerciseSavedSuccess = createAction(
  EXERCISES_ACTION_NAMES.EXERCISE_SAVED_SUCCESS,
);

export const exerciseSavedFailure = createAction(
  EXERCISES_ACTION_NAMES.EXERCISE_SAVED_FAILURE,
);

export const deleteExercise = createAction(
  EXERCISES_ACTION_NAMES.DELETE_EXERCISE,
  props<WithPayload<string>>(),
);

export const deleteExerciseSuccess = createAction(
  EXERCISES_ACTION_NAMES.DELETE_EXERCISE_SUCCESS,
  props<WithPayload<string>>(),
);

export const deleteExerciseFailure = createAction(
  EXERCISES_ACTION_NAMES.DELETE_EXERCISE_FAILURE,
);

export const loadExerciseDetails = createAction(
  EXERCISES_ACTION_NAMES.LOAD_EXERCISE_DETAILS,
  props<WithPayload<string>>(),
);

export const loadExerciseDetailsSuccess = createAction(
  EXERCISES_ACTION_NAMES.LOAD_EXERCISE_DETAILS_SUCCESS,
  props<WithPayload<ExerciseResponseDto>>(),
);

export const releaseExerciseDetails = createAction(
  EXERCISES_ACTION_NAMES.RELEASE_EXERCISE_DETAILS,
);

export const loadExerciseDetailsFailure = createAction(
  EXERCISES_ACTION_NAMES.LOAD_EXERCISE_DETAILS_FAILURE,
);

export const openExerciseDetailsDialog = createAction(
  EXERCISES_ACTION_NAMES.OPEN_EXERCISE_DETAILS_DIALOG,
  props<WithPayload<string>>(),
);