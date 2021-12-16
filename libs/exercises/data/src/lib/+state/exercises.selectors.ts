import {
  ExerciseCollectionsMeta,
  ExerciseMetaCollectionsDictionaryUnit,
  ExercisesEntity,
  ExerciseVM,
} from '@fitness-tracker/exercises/model';
import { selectLanguage } from '@fitness-tracker/shared/data-access';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { LanguageCodes } from 'shared-package';
import { toMetaCollectionDictionaryLocalized } from '../utils/functions/mappers';
import {
  EXERCISES_FEATURE_KEY,
  State,
  exercisesAdapter,
} from './exercises.reducer';

// Lookup the 'Exercises' feature state managed by NgRx
export const getExercisesState = createFeatureSelector<State>(
  EXERCISES_FEATURE_KEY,
);

const { selectAll, selectEntities } = exercisesAdapter.getSelectors();

export const getLoading = createSelector(
  getExercisesState,
  (state: State) => state.loading,
);

export const getMetaCollections = createSelector(
  getExercisesState,
  (state: State) => state.collectionsMeta,
);

export const getExercisesError = createSelector(
  getExercisesState,
  (state: State) => state.error,
);

export const getAllExercises = createSelector(
  getExercisesState,
  (state: State): ExercisesEntity[] => selectAll(state),
);

export const getMetaCollectionsVM = createSelector(
  getMetaCollections,
  selectLanguage,
  (metaCollections: ExerciseCollectionsMeta | null, language: LanguageCodes) =>
    !metaCollections
      ? null
      : toMetaCollectionDictionaryLocalized(metaCollections, language),
);

export const getExercisesListVM = createSelector(
  getAllExercises,
  getMetaCollectionsVM,
  (
    exercises: ExercisesEntity[] | null,
    metaCollectionDictionary: ExerciseMetaCollectionsDictionaryUnit | null,
  ): ExerciseVM[] =>
    (metaCollectionDictionary &&
      exercises?.map(
        ({
          targetMuscle,
          equipment,
          exerciseType,
          ...exercise
        }: ExercisesEntity) => ({
          ...exercise,
          targetMuscle: metaCollectionDictionary.muscles[targetMuscle],
          equipment: metaCollectionDictionary.equipment[equipment],
          exerciseType:
            metaCollectionDictionary['exercise-types'][exerciseType],
        }),
      )) ??
    [],
);

export const getExercisesEntities = createSelector(
  getExercisesState,
  (state: State) => selectEntities(state),
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
