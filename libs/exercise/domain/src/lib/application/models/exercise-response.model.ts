import { WithId } from '@fitness-tracker/shared/utils';
import { ExerciseResponseDto } from '../../entities/response/exercise-response';

export class ExerciseResponseModel {
  public static readonly TARGET_MUSCLES = [
    'NECK',
    'TRAPS',
    'SHOULDERS',
    'CHEST',
    'BICEPS',
    'FOREARM',
    'ABDOMINAL',
    'QUADRICEPS',
    'CALVES',
    'TRICEPS',
    'LATS',
    'MIDDLE_BACK',
    'LOWE_BACK',
    'GLUTES',
    'HAMSTRINGS',
  ] as const;

  public static readonly EQUIPMENT = [
    'BANDS',
    'ROLL',
    'BARBELL',
    'KETTLEBELLS',
    'BODY_ONLY',
    'MACHINE',
    'CABLE',
    'MEDICINE_BALL',
    'DUMBBELL',
    'NONE',
    'E-Z_BAR',
    'OTHER',
    'EXERCISE_BALL',
  ] as const;

  public static readonly EXERCISE_TYPES = [
    'CARDIO',
    'WEIGHTLIFTING',
    'PLYOMETRICS',
    'POWERLIFTING',
    'STRENGTH',
    'STRETCHING',
    'STRONGMAN',
  ] as const;

  public static readonly PROFICIENCY_LEVEL = [
    'BEGINNER',
    'INTERMEDIATE',
    'ADVANCED',
  ] as const;

  public readonly id: string;
  public readonly equipment: string;
  public readonly exerciseType: string;
  public readonly targetMuscle: string;

  public readonly userId: string | null;
  public readonly admin: boolean;

  public readonly name: string;
  public readonly instructions: string[];

  constructor({
    id,
    name,
    equipment,
    exerciseType,
    targetMuscle,
    instructions,
    userId,
    admin,
  }: WithId<ExerciseResponseDto>) {
    this.id = id;
    this.name = name;
    this.equipment = equipment;
    this.exerciseType = exerciseType;
    this.targetMuscle = targetMuscle;
    this.instructions = (instructions ?? []).filter(Boolean);
    this.userId = userId;
    this.admin = admin;
  }
}
