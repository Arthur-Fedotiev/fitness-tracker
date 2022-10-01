import {
  ExercisePagination,
  LOAD_EXERCISES_ACTIONS,
  SearchOptions,
} from '@fitness-tracker/exercise/domain';

import { DEFAULT_PAGINATION_STATE } from '@fitness-tracker/shared/utils';

export const toExerciseLoadState = (
  acc: Pick<SearchOptions, 'pageSize' | 'firstPage' | 'targetMuscles'>,
  { type, payload }: { type: string; payload: object },
): Pick<SearchOptions, 'pageSize' | 'firstPage' | 'targetMuscles'> => ({
  ...acc,
  ...payload,
  ...(type === LOAD_EXERCISES_ACTIONS.EXERCISE_PAGE_QUERY_CHANGE && {
    firstPage: true,
  }),
});

export const toLoadMoreAction = ({
  isLoadMore,
}: {
  isLoadMore: boolean;
}): ExercisePagination =>
  new ExercisePagination({
    ...DEFAULT_PAGINATION_STATE,
    firstPage: !isLoadMore,
  });
