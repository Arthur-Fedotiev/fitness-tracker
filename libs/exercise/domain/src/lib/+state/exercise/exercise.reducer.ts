import { createReducer, on, Action } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import * as ExerciseActions from './exercise.actions';
import { Exercise } from '../../entities/exercise';

export const EXERCISE_FEATURE_KEY = 'exercise-exercise';

export interface State extends EntityState<Exercise> {
  selectedId?: string | number; // which Exercise record has been selected
  loaded: boolean; // has the Exercise list been loaded
  error?: string | null; // last known error (if any)
}

export interface ExercisePartialState {
  readonly [EXERCISE_FEATURE_KEY]: State;
}

export const exerciseAdapter: EntityAdapter<Exercise> =
  createEntityAdapter<Exercise>();

export const initialState: State = exerciseAdapter.getInitialState({
  // set initial required properties
  loaded: false,
});

const exerciseReducer = createReducer(
  initialState,
  on(ExerciseActions.loadExercise, (state) => ({
    ...state,
    loaded: false,
    error: null,
  })),
  on(ExerciseActions.loadExerciseSuccess, (state, { exercise }) =>
    exerciseAdapter.upsertMany(exercise, { ...state, loaded: true }),
  ),
  on(ExerciseActions.loadExerciseFailure, (state, { error }) => ({
    ...state,
    error,
  })),
);

export function reducer(state: State | undefined, action: Action) {
  return exerciseReducer(state, action);
}
