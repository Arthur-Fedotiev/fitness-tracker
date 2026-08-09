import {
  ExercisePagination,
  LOAD_EXERCISES_ACTIONS,
  SearchExercisesState,
  ExerciseResponseModel,
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

export const toExerciseVM =
  (
    isAdmin: boolean,
    uid: string | undefined,
    selectedForWorkoutIds: Set<string>,
  ) =>
  ({
    id,
    name,
    equipment,
    exerciseType,
    targetMuscle,
    userId,
    admin,
  }: ExerciseResponseModel) => ({
    id,
    name,
    equipment,
    exerciseType,
    targetMuscle,
    isSelected: selectedForWorkoutIds.has(id),
    canDelete: admin ? isAdmin : uid === userId,
    canEdit: admin ? isAdmin : uid === userId,
    userId,
  });
