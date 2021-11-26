import { EXERCISE_LOAD_CATEGORY, EXERCISE_MUSCLES_CATEGORY, MUSCLE_LIST } from "..";

export interface Exercise {
  description: string;
  loadCategory: EXERCISE_LOAD_CATEGORY;
  musclesCategory: EXERCISE_MUSCLES_CATEGORY;
  mainLoadMuscle: string;
  name: string;
  url: string;
}

export type IMuscle = typeof MUSCLE_LIST[number];
export type IMuscleList = typeof MUSCLE_LIST;
