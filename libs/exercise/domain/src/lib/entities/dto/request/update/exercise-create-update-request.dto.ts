import { ExerciseRequest } from './exercise-request';

export class CreateUpdateExerciseRequestDTO {
  public targetMuscle: string;
  public exerciseType: string;
  public equipment: string;
  public userId: string | null;
  public admin: boolean;
  public instructions: string[];
  public name: string;

  constructor(
    { targetMuscle, exerciseType, equipment, userId, admin, instructions, name }: ExerciseRequest,
    public readonly id?: string,
  ) {
    this.targetMuscle = targetMuscle;
    this.exerciseType = exerciseType;
    this.equipment = equipment;
    this.userId = userId;
    this.admin = admin;
    this.instructions = instructions;
    this.name = name;
  }
}
