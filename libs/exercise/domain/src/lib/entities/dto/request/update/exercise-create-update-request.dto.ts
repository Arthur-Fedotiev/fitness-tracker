import { INSTRUCTIONS_DELIMITER } from 'shared-package';
import { BaseDataRequest } from './base-data-request';
import { TranslatableExerciseDataRequest } from './translatable-data-request';

export class CreateUpdateExerciseRequestDTO {
  public baseData!: BaseDataRequest;
  public translatableData!: TranslatableExerciseDataRequest;

  constructor(
    {
      avatarUrl,
      avatarSecondaryUrl,
      targetMuscle,
      exerciseType,
      equipment,
      instructionVideo,
      userId,
      admin,
      ...translatableData
    }: BaseDataRequest & TranslatableExerciseDataRequest,
    public readonly id?: string,
  ) {
    this.baseData = {
      avatarUrl,
      avatarSecondaryUrl,
      targetMuscle,
      exerciseType,
      equipment,
      instructionVideo,
      userId,
      admin,
    };
    this.translatableData = translatableData;
  }

  public serialize() {
    return {
      ...this,
      translatableData: {
        ...this.translatableData,
        instructions: this.translatableData.instructions
          .filter(Boolean)
          .join(INSTRUCTIONS_DELIMITER),
      },
    };
  }
}
