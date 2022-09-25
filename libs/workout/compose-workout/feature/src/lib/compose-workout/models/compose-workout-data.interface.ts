import { WorkoutItem, WorkoutBasicInfo } from '@fitness-tracker/workout/data';

export interface ComposeWorkoutData {
  workoutContent: WorkoutItem[];
  workoutBasicInfo?: WorkoutBasicInfo;
}
