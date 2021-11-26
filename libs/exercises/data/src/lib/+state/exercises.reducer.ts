import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on, Action } from '@ngrx/store';

import * as ExercisesActions from './exercises.actions';
import { ExercisesEntity } from './exercises.models';

export const EXERCISES_FEATURE_KEY = 'exercises';

export interface State extends EntityState<ExercisesEntity> {
  selectedId?: string | number; // which Exercises record has been selected
  loaded: boolean; // has the Exercises list been loaded
  error?: string | null; // last known error (if any)
}

export interface ExercisesPartialState {
  readonly [EXERCISES_FEATURE_KEY]: State;
}

export const exercisesAdapter: EntityAdapter<ExercisesEntity> =
  createEntityAdapter<ExercisesEntity>();

export const initialState: State = exercisesAdapter.getInitialState({
  // set initial required properties
  loaded: false,
});

const exercisesReducer = createReducer(
  initialState,
  on(ExercisesActions.loadExercises, (state) => ({
    ...state,
    loaded: false,
    error: null,
  })),
  on(ExercisesActions.loadExercisesSuccess, (state, { exercises }) =>
    exercisesAdapter.setAll(exercises, { ...state, loaded: true })
  ),
  on(ExercisesActions.loadExercisesFailure, (state, { error }) => ({
    ...state,
    error,
  }))
);

export function reducer(state: State | undefined, action: Action) {
  return exercisesReducer(state, action);
}
