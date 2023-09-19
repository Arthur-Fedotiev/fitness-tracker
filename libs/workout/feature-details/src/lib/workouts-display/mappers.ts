import { WorkoutPreview } from '@fitness-tracker/workout-domain';
import { WorkoutPreviewVM } from '@fitness-tracker/workout/ui';
import { MAX_WORKOUT_WITH_PRIORITY } from './constants';

export const toWorkoutPreviewVM =
  (isAdmin: boolean, userId?: string) =>
  (workoutPreview: WorkoutPreview, idx: number) =>
    ({
      ...workoutPreview,
      hasPriority: idx <= MAX_WORKOUT_WITH_PRIORITY,
      canDelete: isAdmin || workoutPreview.userId === userId,
      canEdit: isAdmin || workoutPreview.userId === userId,
    } satisfies WorkoutPreviewVM);
