import { Exercise } from '@fitness-tracker/exercises/model';
import { WithPayload } from '@fitness-tracker/shared/utils';
import { createAction, props } from '@ngrx/store';
import { ExercisesEntity } from '../../../../model/src/lib/exercises-data.models';
import { EXERCISES_ACTION_NAMES } from './models/exercises.actions.enum';

export const init = createAction('[Exercises Page] Init');

export const loadExercises = createAction(
  EXERCISES_ACTION_NAMES.LOAD_EXERCISES
)

export const loadExercisesSuccess = createAction(
  EXERCISES_ACTION_NAMES.LOAD_EXERCISES_SUCCESS,
  props<{ exercises: ExercisesEntity[] }>()
);

export const loadExercisesFailure = createAction(
  EXERCISES_ACTION_NAMES.LOAD_EXERCISES_FAILURE,
  props<{ error: any }>()
);

export const createExercise = createAction(
  EXERCISES_ACTION_NAMES.CREATE_EXERCISE,
  props<WithPayload<ExercisesEntity>>()
);

export const createExercisesSuccess = createAction(
  EXERCISES_ACTION_NAMES.CREATE_EXERCISE_SUCCESS,
);

export const createExercisesFailure = createAction(
  EXERCISES_ACTION_NAMES.CREATE_EXERCISE_FAILURE,
  props<WithPayload<string>>()
);
