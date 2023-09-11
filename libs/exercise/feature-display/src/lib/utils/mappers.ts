import {
  ExercisePagination,
  LOAD_EXERCISES_ACTIONS,
  SearchExercisesState,
} from '@fitness-tracker/exercise/domain';

import { DEFAULT_PAGINATION_STATE } from '@fitness-tracker/shared/utils';

export const toExerciseLoadState = (
  acc: SearchExercisesState,
  { type, payload }: { type: string; payload: object },
) =>
  ({
    ...acc,
    ...payload,
    ...(type === LOAD_EXERCISES_ACTIONS.EXERCISE_QUERY_CHANGE && {
      firstPage: true,
    }),
  } satisfies SearchExercisesState);

export const toLoadMoreAction = ({ isLoadMore }: { isLoadMore: boolean }) =>
  new ExercisePagination({
    ...DEFAULT_PAGINATION_STATE,
    firstPage: !isLoadMore,
  });
