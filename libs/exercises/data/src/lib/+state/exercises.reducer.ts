import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on, Action } from '@ngrx/store';

import * as ExercisesActions from './exercises.actions';
import { ExercisesEntity } from '@fitness-tracker/exercises/model';

export const EXERCISES_FEATURE_KEY = 'exercises';
export const sortComparer = (a: ExercisesEntity, b: ExercisesEntity) =>
  b.rating - a.rating > 0 ? 1 : -1;

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
  createEntityAdapter<ExercisesEntity>({
    sortComparer
  });

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
  on(ExercisesActions.findExercises, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(ExercisesActions.findExercisesSuccess, (state, { payload }) =>
    exercisesAdapter.addMany(payload, { ...state, loading: false })
  ),
  on(ExercisesActions.findExercisesFailure, (state) => ({
    ...state,
    loading: false,
  })),
  on(ExercisesActions.createExercise, (state, { payload }) =>
    exercisesAdapter.addOne(payload, { ...state, loading: false })
  ),
  on(ExercisesActions.deleteExerciseSuccess, (state, { payload }) => exercisesAdapter.removeOne(payload, state)),
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
