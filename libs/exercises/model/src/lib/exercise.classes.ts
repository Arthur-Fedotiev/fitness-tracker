import {
  ExerciseBaseData,
  Exercise,
  ExerciseTranslatableData,
  ExercisesEntity,
  ExerciseCollectionsMeta,
} from './exercise-model';

export class ExerciseRequestDTO {
  public baseData!: ExerciseBaseData;
  public translatableData!: ExerciseTranslatableData;

  constructor(
    {
      rating,
      avatarUrl,
      coverUrl,
      targetMuscle,
      exerciseType,
      equipment,
      ...translatableData
    }: Exercise,
    id?: string,
  ) {
    this.baseData = {
      rating,
      coverUrl,
      avatarUrl,
      targetMuscle,
      exerciseType,
      equipment,
      id,
    };
    this.translatableData = translatableData;
  }

  public setId(id: string): ExerciseRequestDTO {
    this.baseData.id = id;

    return this;
  }

  public serialize(): ExerciseMetaDTO {
    return { ...this };
  }
}

// export class ExerciseVM implements ExercisesEntity {
//   constructor(
//     public exercise: ExercisesEntity,
//     public metaCollections: ExerciseCollectionsMeta,
//   ) {}


//   private toExerciseVM() {

//   }
// }

export type ExerciseMetaDTO = Pick<
  ExerciseRequestDTO,
  'baseData' | 'translatableData'
>;

export interface ExerciseBase {
  rating: number;
  avatarUrl: string;
  coverUrl: string;
}
