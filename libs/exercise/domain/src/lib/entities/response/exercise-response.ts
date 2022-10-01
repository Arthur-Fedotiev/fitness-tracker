import { Exercise } from 'shared-package';

type BaseDataKeys = keyof Pick<
  Exercise,
  | 'avatarSecondaryUrl'
  | 'avatarUrl'
  | 'coverSecondaryUrl'
  | 'coverUrl'
  | 'equipment'
  | 'exerciseType'
  | 'instructionVideo'
  | 'muscleDiagramUrl'
  | 'rating'
  | 'targetMuscle'
>;

export interface ExerciseResponse {
  readonly baseData: Pick<Exercise, BaseDataKeys>;
}
