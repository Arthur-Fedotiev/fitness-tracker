import { ExerciseRequest } from './exercise-request';

export class CreateUpdateExerciseRequestDTO {
  public targetMuscles: string[];
  public exerciseType: string;
  public equipment: string;
  public userId: string | null;
  public admin: boolean;
  public instructions: string[];
  public name: string;

  constructor(
    { targetMuscles, exerciseType, equipment, userId, admin, instructions, name }: ExerciseRequest,
    public readonly id?: string,
  ) {
    this.targetMuscles = targetMuscles;
    this.exerciseType = exerciseType;
    this.equipment = equipment;
    this.userId = userId;
    this.admin = admin;
    this.instructions = instructions;
    this.name = name;
  }
}
