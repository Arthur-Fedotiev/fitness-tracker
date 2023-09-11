import { BaseDataRequest } from './base-data-request';
import { TranslatableExerciseDataRequest } from './translatable-data-request';

export class CreateUpdateExerciseRequestDTO {
  public baseData!: BaseDataRequest;
  public translatableData!: TranslatableExerciseDataRequest;

  constructor(
    {
      rating,
      avatarUrl,
      avatarSecondaryUrl,
      coverUrl,
      coverSecondaryUrl,
      targetMuscle,
      exerciseType,
      equipment,
      instructionVideo,
      muscleDiagramUrl,
      userId,
      admin,
      ...translatableData
    }: BaseDataRequest & TranslatableExerciseDataRequest,
    id?: string,
  ) {
    this.baseData = {
      rating,
      coverUrl,
      coverSecondaryUrl,
      avatarUrl,
      avatarSecondaryUrl,
      targetMuscle,
      exerciseType,
      equipment,
      id,
      instructionVideo,
      muscleDiagramUrl,
      userId,
      admin,
    };
    this.translatableData = translatableData;
  }

  public setId(id: string): this {
    this.baseData.id = id;

    return this;
  }

  public serialize(): this {
    return { ...this };
  }
}
