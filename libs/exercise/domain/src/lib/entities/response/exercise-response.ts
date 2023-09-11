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
  | 'userId'
  | 'admin'
>;

export interface ExerciseResponseDto {
  readonly baseData: Pick<Exercise, BaseDataKeys>;
}
