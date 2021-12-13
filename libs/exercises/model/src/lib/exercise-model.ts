import { EQUIPMENT, EXERCISE_TYPES, MUSCLE_LIST } from '..';
import { Exercise as IExercise } from 'shared-package';

export type Exercise = IExercise;

export type Muscle = typeof MUSCLE_LIST[number];
export type MuscleList = typeof MUSCLE_LIST;
export type Equipment = typeof EQUIPMENT;
export type EquipmentItem = Equipment[number];
export type ExerciseTypes = typeof EXERCISE_TYPES;
export type ExerciseType = ExerciseTypes[number];

/// !REFACTOR
export interface ExerciseFormData {
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

export type ExerciseBaseData = Pick<
  ExerciseFormData,
  'rating' | 'avatarUrl' | 'coverUrl'
> & { id?: string };
export type ExerciseTranslatableData = Omit<
  ExerciseFormData,
  keyof ExerciseBaseData
>;
export type WithOptionalId<T> = T & { id?: string };
