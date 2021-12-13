import { Exercise } from '..';
import {
  ExerciseBaseData,
  ExerciseFormData,
  ExerciseTranslatableData,
} from './exercise-model';

export class ExerciseRequestDTO {
  public baseData!: ExerciseBaseData;
  public translatableData!: ExerciseTranslatableData;

  constructor(
    { rating, avatarUrl, coverUrl, ...translatableData }: ExerciseFormData,
    id?: string,
  ) {
    this.baseData = { rating, coverUrl, avatarUrl, id };
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

export type ExerciseMetaDTO = Pick<
  ExerciseRequestDTO,
  'baseData' | 'translatableData'
>;

export interface ExerciseBase {
  rating: number;
  avatarUrl: string;
  coverUrl: string;
}
