import { WorkoutDetails } from '../classes';

export interface WorkoutDetailsVm extends WorkoutDetails {
  totalReps: number;
  totalSets: number;
  totalExercises: number;
  estimatedDurationMin: number;
}
