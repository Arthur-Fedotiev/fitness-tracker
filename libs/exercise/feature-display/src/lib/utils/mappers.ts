import {
  ExercisePagination,
  LOAD_EXERCISES_ACTIONS,
  SearchExercisesState,
  ExerciseResponseModel,
} from '@fitness-tracker/exercise/domain';

import { DEFAULT_PAGINATION_STATE } from '@fitness-tracker/shared/utils';

const MAX_COUNT_OF_EXERCISES_WITH_PRIORITY = 4;

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
  (
    {
      id,
      name,
      avatarUrl,
      avatarSecondaryUrl,
      equipment,
      exerciseType,
      instructionVideo,
      targetMuscle,
      userId,
      admin,
    }: ExerciseResponseModel,
    idx: number,
  ) => ({
    id,
    name,
    avatarUrl,
    avatarSecondaryUrl,
    equipment,
    exerciseType,
    instructionVideo,
    targetMuscle,
    isSelected: selectedForWorkoutIds.has(id),
    canDelete: admin ? isAdmin : uid === userId,
    canEdit: admin ? isAdmin : uid === userId,
    userId,
    hasPriority: idx <= MAX_COUNT_OF_EXERCISES_WITH_PRIORITY,
  });
