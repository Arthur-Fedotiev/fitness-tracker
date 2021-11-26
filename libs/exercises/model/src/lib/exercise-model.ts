import { EXERCISE_LOAD_CATEGORY, EXERCISE_MUSCLES_CATEGORY, MUSCLE_LIST } from "..";

export interface Exercise {
  name: string;
  shortDescription: string;
  longDescription: string;
  instructions: string[];
  benefits: string[];
  loadCategory: EXERCISE_LOAD_CATEGORY;
  musclesCategory: EXERCISE_MUSCLES_CATEGORY;
  targetMuscle: string;
  imgUrl: string;
  rating: number;
}

export type IMuscle = typeof MUSCLE_LIST[number];
export type IMuscleList = typeof MUSCLE_LIST;
