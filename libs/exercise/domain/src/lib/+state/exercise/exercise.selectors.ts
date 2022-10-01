import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ExerciseResponseDto } from '../../entities/dto/response/exercise-response.dto';
import {
  exercisesAdapter,
  EXERCISES_FEATURE_KEY,
  State,
} from './exercise.reducer';

export const getExercisesState = createFeatureSelector<State>(
  EXERCISES_FEATURE_KEY,
);

const { selectAll, selectEntities } = exercisesAdapter.getSelectors();

export const getLoading = createSelector(
  getExercisesState,
  (state: State) => state.loading,
);

export const getExercisesError = createSelector(
  getExercisesState,
  (state: State) => state.error,
);

export const getAllExercises = createSelector(
  getExercisesState,
  (state: State): ExerciseResponseDto[] => selectAll(state),
);

export const getExercisesEntities = createSelector(
  getExercisesState,
  (state: State) => selectEntities(state),
);

export const selectExercisePreview = (exerciseIds: Set<string>) =>
  createSelector(
    getExercisesEntities,
    (entities): Pick<ExerciseResponseDto, 'avatarUrl' | 'id' | 'name'>[] =>
      [...exerciseIds].map((exerciseId) => {
        const { id, name, avatarUrl } = entities[
          exerciseId
        ] as ExerciseResponseDto;
        return { id, name, avatarUrl };
      }),
  );

export const getSelectedId = createSelector(
  getExercisesState,
  (state: State) => state.selectedId,
);

export const getSelected = createSelector(
  getExercisesEntities,
  getSelectedId,
  (entities, selectedId) => (selectedId ? entities[selectedId] : undefined),
);

export const getSelectedExerciseDetails = createSelector(
  getExercisesState,
  (state: State) => state.selectedExercise,
);
