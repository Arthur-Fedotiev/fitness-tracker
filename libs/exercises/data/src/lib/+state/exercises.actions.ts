import { createAction, props } from '@ngrx/store';
import { ExercisesEntity } from './exercises.models';

export const init = createAction('[Exercises Page] Init');

export const loadExercisesSuccess = createAction(
  '[Exercises/API] Load Exercises Success',
  props<{ exercises: ExercisesEntity[] }>()
);

export const loadExercisesFailure = createAction(
  '[Exercises/API] Load Exercises Failure',
  props<{ error: any }>()
);
