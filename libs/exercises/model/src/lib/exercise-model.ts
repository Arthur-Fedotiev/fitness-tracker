import {
  EQUIPMENT,
  EQUIPMENT_KEYS,
  EXERCISE_TYPES,
  EXERCISE_TYPE_KEYS,
  MUSCLE_KEYS,
  MUSCLE_LIST,
} from '..';
import {
  Exercise as IExercise,
  COLLECTIONS,
  LanguageCodes,
} from 'shared-package';

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

export type CollectionsMetaKeys =
  | COLLECTIONS.EQUIPMENT
  | COLLECTIONS.EXERCISE_TYPES
  | COLLECTIONS.MUSCLES;

export interface ExerciseCollectionsMeta {
  [COLLECTIONS.MUSCLES]: MuscleMetaUnit;
  [COLLECTIONS.EQUIPMENT]: EquipmentMetaUnit;
  [COLLECTIONS.EXERCISE_TYPES]: ExerciseTypesMetaUnit;
}

export type CollectionMetaUnit<T extends ReadonlyArray<string>> = {
  [lang in LanguageCodes]: { [key in T[number]]: string };
};

export type MuscleMetaUnit = CollectionMetaUnit<typeof MUSCLE_KEYS>;
export type EquipmentMetaUnit = CollectionMetaUnit<typeof EQUIPMENT_KEYS>;
export type ExerciseTypesMetaUnit = CollectionMetaUnit<
  typeof EXERCISE_TYPE_KEYS
>;

export type ExercisesMetaUnit =
  | MuscleMetaUnit
  | EquipmentMetaUnit
  | ExerciseTypesMetaUnit;

//

export interface ExerciseCollectionsMetaArrays {
  [COLLECTIONS.MUSCLES]: MuscleMetaArray;
  [COLLECTIONS.EQUIPMENT]: EquipmentMetaArray;
  [COLLECTIONS.EXERCISE_TYPES]: ExerciseTypesMetaArray;
}

export type CollectionMetaArray<T extends ReadonlyArray<string>> = {
  [key: number]: { [key in T[number]]: string };
};

export type MuscleMetaArray = CollectionMetaArray<typeof MUSCLE_KEYS>;
export type EquipmentMetaArray = CollectionMetaArray<typeof EQUIPMENT_KEYS>;
export type ExerciseTypesMetaArray = CollectionMetaArray<
  typeof EXERCISE_TYPE_KEYS
>;

export type ExercisesMetaCollectionKeyTypes =
  | typeof MUSCLE_KEYS
  | typeof EQUIPMENT_KEYS
  | typeof EXERCISE_TYPE_KEYS;

export type MetaArrayDoc = Partial<
  CollectionMetaArray<ExercisesMetaCollectionKeyTypes>[number]
>;
