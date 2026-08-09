import { INSTRUCTIONS_DELIMITER } from 'shared-package';
import { BaseDataRequest } from './base-data-request';
import { TranslatableExerciseDataRequest } from './translatable-data-request';

export class CreateUpdateExerciseRequestDTO {
  public baseData!: BaseDataRequest;
  public translatableData!: TranslatableExerciseDataRequest;

  constructor(
    {
      targetMuscle,
      exerciseType,
      equipment,
      userId,
      admin,
      instructions,
      name,
    }: BaseDataRequest & TranslatableExerciseDataRequest,
    public readonly id?: string,
  ) {
    this.baseData = {
      targetMuscle,
      exerciseType,
      equipment,
      userId,
      admin,
    };
    this.translatableData = {
      instructions,
      name,
    };
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
