import { Exercise } from 'shared-package';

export type ExerciseFromModel = Pick<
  Exercise,
  | 'avatarUrl'
  | 'avatarSecondaryUrl'
  | 'targetMuscle'
  | 'exerciseType'
  | 'equipment'
  | 'instructionVideo'
  | 'name'
  | 'instructions'
>;

export interface SaveExerciseCommandModel {
  exercise: ExerciseFromModel;
  id?: string;
}
