import { BaseDataRequest } from './base-data-request';

export class CreateUpdateExerciseRequestDTO {
  public baseData!: BaseDataRequest;

  constructor(
    {
      targetMuscle,
      exerciseType,
      equipment,
      userId,
      admin,
      instructions,
      name,
    }: BaseDataRequest,
    public readonly id?: string,
  ) {
    this.baseData = {
      targetMuscle,
      exerciseType,
      equipment,
      userId,
      admin,
      instructions,
      name,
    };
  }
}
