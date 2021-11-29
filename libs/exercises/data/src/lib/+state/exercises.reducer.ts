import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on, Action } from '@ngrx/store';

import * as ExercisesActions from './exercises.actions';
import { ExercisesEntity } from '@fitness-tracker/exercises/model';

export const EXERCISES_FEATURE_KEY = 'exercises';

export interface State extends EntityState<ExercisesEntity> {
  selectedId?: string | number; // which Exercises record has been selected
  selectedExercise: ExercisesEntity | null;
  loading: boolean; // has the Exercises list been loading
  error?: string | null; // last known error (if any)
}

export interface ExercisesPartialState {
  readonly [EXERCISES_FEATURE_KEY]: State;
}

export const exercisesAdapter: EntityAdapter<ExercisesEntity> =
  createEntityAdapter<ExercisesEntity>();

export const initialState: State = exercisesAdapter.getInitialState({
  // set initial required properties
  loading: false,
  selectedExercise: null,
});

const exercisesReducer = createReducer(
  initialState,
  on(ExercisesActions.loadExercises, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(ExercisesActions.loadExercisesSuccess, (state, { exercises }) =>
    exercisesAdapter.setAll(exercises, { ...state, loading: false })
  ),
  on(ExercisesActions.loadExercisesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(ExercisesActions.createExercise, (state, { payload }) =>
    exercisesAdapter.addOne(payload, { ...state, loading: false })
  ),
  on(ExercisesActions.loadExerciseDetails, (state) => ({ ...state, loading: true })),
  on(ExercisesActions.loadExerciseDetailsSuccess, (state, { payload }) => ({
    ...state,
    loading: false,
    selectedExercise: payload
  })),
  on(ExercisesActions.loadExerciseDetailsFailure, (state) => ({
    ...state,
    loading: false,
  })),
  on(ExercisesActions.releaseExerciseDetails, (state) => ({
    ...state,
    selectedExercise: null,
  })),
);

export function reducer(state: State | undefined, action: Action) {
  return exercisesReducer(state, action);
}
