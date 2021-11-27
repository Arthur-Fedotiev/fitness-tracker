import { EXERCISE_LOAD_CATEGORY, EQUIPMENT, EXERCISE_MUSCLES_CATEGORY, EXERCISE_TYPES, MUSCLE_LIST } from "..";

export interface Exercise {
  name: string;
  exerciseType: string;
  targetMuscle: string;
  equipment: string;
  rating: number;
  avatarUrl: string;
  coverUrl: string;
  shortDescription: string;
  longDescription: string;
  instructions: string[];
  benefits: string[];
}

export type Muscle = typeof MUSCLE_LIST[number];
export type MuscleList = typeof MUSCLE_LIST;
export type Equipment = typeof EQUIPMENT;
export type EquipmentItem = Equipment[number];
export type ExerciseTypes = typeof EXERCISE_TYPES;
export type ExerciseType = ExerciseTypes[number];
