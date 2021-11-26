import { createAction, props } from '@ngrx/store';
import { ExercisesEntity } from '../../../../model/src/lib/exercises-data.models';
import { EXERCISES_EXETCION_NAMES } from './models/exercises.actions.enum';

export const init = createAction('[Exercises Page] Init');

export const loadExercises = createAction(
  EXERCISES_EXETCION_NAMES.LOAD_EXERCISES
)

export const loadExercisesSuccess = createAction(
  EXERCISES_EXETCION_NAMES.LOAD_EXERCISES_SUCCESS,
  props<{ exercises: ExercisesEntity[] }>()
);

export const loadExercisesFailure = createAction(
  EXERCISES_EXETCION_NAMES.LOAD_EXERCISES_FAILURE,
  props<{ error: any }>()
);
