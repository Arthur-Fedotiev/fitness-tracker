import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  EXERCISES_FEATURE_KEY,
  State,
  exercisesAdapter,
} from './exercises.reducer';

// Lookup the 'Exercises' feature state managed by NgRx
export const getExercisesState = createFeatureSelector<State>(
  EXERCISES_FEATURE_KEY
);

const { selectAll, selectEntities } = exercisesAdapter.getSelectors();

export const getExercisesLoaded = createSelector(
  getExercisesState,
  (state: State) => state.loaded
);

export const getExercisesError = createSelector(
  getExercisesState,
  (state: State) => state.error
);

export const getAllExercises = createSelector(
  getExercisesState,
  (state: State) => selectAll(state)
);

export const getExercisesEntities = createSelector(
  getExercisesState,
  (state: State) => selectEntities(state)
);

export const getSelectedId = createSelector(
  getExercisesState,
  (state: State) => state.selectedId
);

export const getSelected = createSelector(
  getExercisesEntities,
  getSelectedId,
  (entities, selectedId) => (selectedId ? entities[selectedId] : undefined)
);
