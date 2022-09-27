import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  EXERCISE_FEATURE_KEY,
  State,
  ExercisePartialState,
  exerciseAdapter,
} from './exercise.reducer';

// Lookup the 'Exercise' feature state managed by NgRx
export const getExerciseState = createFeatureSelector<
  ExercisePartialState,
  State
>(EXERCISE_FEATURE_KEY);

const { selectAll, selectEntities } = exerciseAdapter.getSelectors();

export const getExerciseLoaded = createSelector(
  getExerciseState,
  (state: State) => state.loaded,
);

export const getExerciseError = createSelector(
  getExerciseState,
  (state: State) => state.error,
);

export const getAllExercise = createSelector(getExerciseState, (state: State) =>
  selectAll(state),
);

export const getExerciseEntities = createSelector(
  getExerciseState,
  (state: State) => selectEntities(state),
);

export const getSelectedId = createSelector(
  getExerciseState,
  (state: State) => state.selectedId,
);

export const getSelected = createSelector(
  getExerciseEntities,
  getSelectedId,
  (entities, selectedId) => selectedId && entities[selectedId],
);
