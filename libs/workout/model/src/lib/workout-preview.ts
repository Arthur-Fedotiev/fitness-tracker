import { WorkoutLevel } from './workout-level';

export interface WorkoutPreview {
  id: string;
  name: string;
  img: string;
  level: WorkoutLevel;
  muscles: string[];
}
