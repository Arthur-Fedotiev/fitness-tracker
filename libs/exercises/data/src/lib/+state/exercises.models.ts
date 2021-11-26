import { Exercise } from "@fitness-tracker/exercises/model";

export interface ExercisesEntity extends Exercise {
  id: string | number;
}
