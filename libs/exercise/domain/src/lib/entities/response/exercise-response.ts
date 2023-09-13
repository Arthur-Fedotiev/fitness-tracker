import { Exercise } from 'shared-package';

type BaseDataKeys = keyof Pick<
  Exercise,
  | 'avatarSecondaryUrl'
  | 'avatarUrl'
  | 'equipment'
  | 'exerciseType'
  | 'instructionVideo'
  | 'targetMuscle'
  | 'userId'
  | 'admin'
>;

export interface ExerciseResponseDto {
  readonly baseData: Pick<Exercise, BaseDataKeys>;
}
