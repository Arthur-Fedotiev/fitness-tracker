import { WorkoutItem, WorkoutBasicInfo } from './classes';

export interface WorkoutExercise {
  readonly id: string;
  readonly name: string;
}

export interface ComposeWorkoutData {
  workoutContent: WorkoutItem[];
  workoutBasicInfo?: WorkoutBasicInfo;
}
