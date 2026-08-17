import { WithId } from '@fitness-tracker/shared/utils';
import { ExerciseResponseDto } from '../../entities/response/exercise-response';

export class ExerciseResponseModel {
  public readonly id: string;
  public readonly equipment: string;
  public readonly exerciseType: string;
  public readonly targetMuscles: string[];

  public readonly userId: string | null;
  public readonly admin: boolean;

  public readonly name: string;
  public readonly instructions: string[];

  constructor({
    id,
    name,
    equipment,
    exerciseType,
    targetMuscles,
    instructions,
    userId,
    admin,
  }: WithId<ExerciseResponseDto>) {
    this.id = id;
    this.name = name;
    this.equipment = equipment;
    this.exerciseType = exerciseType;
    this.targetMuscles = targetMuscles;
    this.instructions = (instructions ?? []).filter(Boolean);
    this.userId = userId;
    this.admin = admin;
  }
}
