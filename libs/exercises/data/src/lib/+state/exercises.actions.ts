import { SearchOptions, WithPayload } from '@fitness-tracker/shared/utils';
import { createAction, props } from '@ngrx/store';
import {
  ExerciseMetaDTO,
  ExerciseRequestDTO,
  ExercisesEntity,
} from '@fitness-tracker/exercises/model';
import { EXERCISES_ACTION_NAMES } from './models/exercises.actions.enum';

export const init = createAction('[Exercises Page] Init');

export const loadExercises = createAction(
  EXERCISES_ACTION_NAMES.LOAD_EXERCISES,
);

export const loadExercisesSuccess = createAction(
  EXERCISES_ACTION_NAMES.LOAD_EXERCISES_SUCCESS,
  props<{ exercises: ExercisesEntity[] }>(),
);

export const loadExercisesFailure = createAction(
  EXERCISES_ACTION_NAMES.LOAD_EXERCISES_FAILURE,
  props<{ error: any }>(),
);

export const findExercises = createAction(
  EXERCISES_ACTION_NAMES.FIND_EXERCISES,
  props<WithPayload<Partial<SearchOptions>>>(),
);

export const findExercisesSuccess = createAction(
  EXERCISES_ACTION_NAMES.FIND_EXERCISES_SUCCESS,
  props<WithPayload<ExercisesEntity[]>>(),
);

export const findExercisesFailure = createAction(
  EXERCISES_ACTION_NAMES.FIND_EXERCISES_FAILURE,
);

export const emptyExercisesList = createAction(
  EXERCISES_ACTION_NAMES.EMPTY_EXERCISES,
);

export const createExercise = createAction(
  EXERCISES_ACTION_NAMES.CREATE_EXERCISE,
  props<WithPayload<ExercisesEntity>>(),
);

export const createExerciseMeta = createAction(
  EXERCISES_ACTION_NAMES.CREATE_EXERCISE,
  props<WithPayload<ExerciseMetaDTO>>(),
);

export const createExerciseSuccess = createAction(
  EXERCISES_ACTION_NAMES.CREATE_EXERCISE_SUCCESS,
);

export const createExerciseFailure = createAction(
  EXERCISES_ACTION_NAMES.CREATE_EXERCISE_FAILURE,
  props<WithPayload<string>>(),
);

export const updateExercise = createAction(
  EXERCISES_ACTION_NAMES.UPDATE_EXERCISE,
  props<WithPayload<ExerciseMetaDTO>>(),
);

export const updateExerciseSuccess = createAction(
  EXERCISES_ACTION_NAMES.UPDATE_EXERCISE_SUCCESS,
);

export const updateExerciseFailure = createAction(
  EXERCISES_ACTION_NAMES.LOAD_EXERCISES,
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
  props<WithPayload<ExercisesEntity>>(),
);

export const releaseExerciseDetails = createAction(
  EXERCISES_ACTION_NAMES.RELEASE_EXERCISE_DETAILS,
);

export const loadExerciseDetailsFailure = createAction(
  EXERCISES_ACTION_NAMES.LOAD_EXERCISE_DETAILS_FAILURE,
);
