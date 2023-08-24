import { WorkoutItem, WorkoutBasicInfo } from '@fitness-tracker/workout-domain';

export interface ComposeWorkoutData {
  workoutContent: WorkoutItem[];
  workoutBasicInfo?: WorkoutBasicInfo;
}
