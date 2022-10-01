import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on, Action } from '@ngrx/store';
import * as ExerciseActions from './exercise.actions';

import { ExerciseResponseDto } from '../../entities/dto/response/exercise-response.dto';

export const EXERCISES_FEATURE_KEY = 'exercises';
export const sortComparer = (a: ExerciseResponseDto, b: ExerciseResponseDto) =>
  b.rating - a.rating > 0 ? 1 : -1;

export interface State extends EntityState<ExerciseResponseDto> {
  selectedId?: string | number;
  selectedExercise: ExerciseResponseDto | null;
  loading: boolean;
  error?: string | null;
}

export interface ExercisesPartialState {
  readonly [EXERCISES_FEATURE_KEY]: State;
}

export const exercisesAdapter: EntityAdapter<ExerciseResponseDto> =
  createEntityAdapter<ExerciseResponseDto>({
    sortComparer,
  });

export const initialState: State = exercisesAdapter.getInitialState({
  loading: false,
  selectedExercise: null,
  collectionsMeta: null,
});

const exercisesReducer = createReducer(
  initialState,
  on(ExerciseActions.refreshExercises, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(ExerciseActions.refreshExercisesSuccess, (state, { payload }) =>
    exercisesAdapter.setAll(payload, { ...state, loading: false }),
  ),
  on(ExerciseActions.refreshExercisesFailure, (state) => ({
    ...state,
    loading: false,
  })),
  on(ExerciseActions.findExercises, (state) => ({
    ...state,
    loading: true,
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
    loading: false,
  })),
  on(ExerciseActions.emptyExercisesList, (state) =>
    exercisesAdapter.removeAll(state),
  ),
  on(ExerciseActions.createExercise, (state, { payload }) =>
    exercisesAdapter.addOne(payload, { ...state, loading: false }),
  ),
  on(ExerciseActions.deleteExerciseSuccess, (state, { payload }) =>
    exercisesAdapter.removeOne(payload, state),
  ),
  on(ExerciseActions.loadExerciseDetails, (state) => ({
    ...state,
    loading: true,
  })),
  on(ExerciseActions.loadExerciseDetailsSuccess, (state, { payload }) => ({
    ...state,
    loading: false,
    selectedExercise: payload,
  })),
  on(ExerciseActions.loadExerciseDetailsFailure, (state) => ({
    ...state,
    loading: false,
  })),
  on(ExerciseActions.releaseExerciseDetails, (state) => ({
    ...state,
    selectedExercise: null,
  })),
);

export function reducer(state: State | undefined, action: Action) {
  return exercisesReducer(state, action);
}
