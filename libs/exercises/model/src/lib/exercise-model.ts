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

export type Exercise = IExercise & {
  targetMuscle: typeof MUSCLE_KEYS[number];
  equipment: typeof EQUIPMENT_KEYS[number];
  exerciseType: typeof EXERCISE_TYPE_KEYS[number];
};
export interface ExercisesEntity extends Exercise {
  id: string;
}

export interface ExerciseVM extends IExercise {
  id: string;
}

export type Muscle = typeof MUSCLE_LIST[number];
export type MuscleList = typeof MUSCLE_LIST;
export type Equipment = typeof EQUIPMENT;
export type EquipmentItem = Equipment[number];
export type ExerciseTypes = typeof EXERCISE_TYPES;
export type ExerciseType = ExerciseTypes[number];

export type ExerciseBaseData = Pick<
  ExercisesEntity,
  | 'rating'
  | 'avatarUrl'
  | 'coverUrl'
  | 'equipment'
  | 'exerciseType'
  | 'targetMuscle'
  | 'avatarSecondaryUrl'
  | 'coverSecondaryUrl'
  | 'instructionVideo'
  | 'muscleDiagramUrl'
> & { id?: string };

export type ExerciseTranslatableData = Omit<Exercise, keyof ExerciseBaseData>;
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

export interface ExerciseMetaCollectionsDictionaryUnit {
  [COLLECTIONS.MUSCLES]: MuscleMetaUnit[LanguageCodes];
  [COLLECTIONS.EQUIPMENT]: EquipmentMetaUnit[LanguageCodes];
  [COLLECTIONS.EXERCISE_TYPES]: ExerciseTypesMetaUnit[LanguageCodes];
}

export type ExerciseVm = Omit<Exercise, 'instructions'> & {
  instructions: string[];
};
