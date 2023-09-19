import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on, Action } from '@ngrx/store';
import * as ExerciseActions from './exercise.actions';

import { ExerciseResponseModel } from '../models/exercise-response.model';

export const EXERCISES_FEATURE_KEY = 'exercises';
export const sortComparer = false;

export interface State extends EntityState<ExerciseResponseModel> {
  selectedId?: string | number;
  selectedExercise: ExerciseResponseModel | null;
  listLoading: boolean;
  error?: string | null;
}

export interface ExercisesPartialState {
  readonly [EXERCISES_FEATURE_KEY]: State;
}

export const exercisesAdapter: EntityAdapter<ExerciseResponseModel> =
  createEntityAdapter<ExerciseResponseModel>({
    sortComparer,
  });

export const initialState: State = exercisesAdapter.getInitialState({
  listLoading: false,
  selectedExercise: null,
});

const exercisesReducer = createReducer(
  initialState,
  on(ExerciseActions.refreshExercises, (state) => ({
    ...state,
    listLoading: true,
    error: null,
  })),
  on(ExerciseActions.refreshExercisesSuccess, (state, { payload }) =>
    exercisesAdapter.setAll(payload, { ...state, loading: false }),
  ),
  on(ExerciseActions.refreshExercisesFailure, (state) => ({
    ...state,
    listLoading: false,
  })),
  on(ExerciseActions.findExercises, (state) => ({
    ...state,
    listLoading: true,
    error: null,
  })),
  on(ExerciseActions.findExercisesSuccess, (state, { payload }) => {
    const adapterAction = payload.firstPage
      ? exercisesAdapter.setAll
      : exercisesAdapter.addMany;

    return adapterAction(payload.exercises, {
      ...state,
      loading: false,
    });
  }),
  on(ExerciseActions.findExercisesFailure, (state) => ({
    ...state,
    listLoading: false,
  })),
  on(ExerciseActions.emptyExercisesList, (state) =>
    exercisesAdapter.removeAll(state),
  ),
  on(ExerciseActions.deleteExerciseSuccess, (state, { payload }) =>
    exercisesAdapter.removeOne(payload, state),
  ),
  on(ExerciseActions.loadExerciseDetails, (state) => ({
    ...state,
    listLoading: true,
  })),
  on(ExerciseActions.loadExerciseDetailsSuccess, (state, { payload }) => ({
    ...state,
    listLoading: false,
    selectedExercise: payload,
  })),
  on(ExerciseActions.loadExerciseDetailsFailure, (state) => ({
    ...state,
    listLoading: false,
  })),
  on(ExerciseActions.releaseExerciseDetails, (state) => ({
    ...state,
    selectedExercise: null,
  })),
);

export function reducer(state: State | undefined, action: Action) {
  return exercisesReducer(state, action);
}
