import { createAction, props } from '@ngrx/store';
import { Exercise } from '../../entities/exercise';

export const loadExercise = createAction('[Exercise] Load Exercise');

export const loadExerciseSuccess = createAction(
  '[Exercise] Load Exercise Success',
  props<{ exercise: Exercise[] }>(),
);

export const loadExerciseFailure = createAction(
  '[Exercise] Load Exercise Failure',
  props<{ error: any }>(),
);
