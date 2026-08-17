import { Exercise } from 'shared-package';

export type ExerciseFromModel = Pick<
  Exercise,
  'targetMuscles' | 'exerciseType' | 'equipment' | 'name' | 'instructions'
>;

export interface SaveExerciseCommandModel {
  exercise: ExerciseFromModel;
  id?: string;
}
