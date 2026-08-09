import { Exercise } from 'shared-package';

type BaseDataKeys = keyof Pick<
  Exercise,
  'equipment' | 'exerciseType' | 'targetMuscle' | 'userId' | 'admin' | 'name' | 'instructions'
>;

export interface ExerciseResponseDto {
  readonly baseData: Pick<Exercise, BaseDataKeys>;
}
