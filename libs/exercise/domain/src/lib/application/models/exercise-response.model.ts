import { WithId } from '@fitness-tracker/shared/utils';
import { ExerciseResponseDto } from '../../entities/response/exercise-response';
import { ExerciseTranslationResponse } from '../../entities/response/exercise-translation-response';

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
  public readonly avatarUrl: string;
  public readonly avatarSecondaryUrl: string;
  public readonly equipment: string;
  public readonly exerciseType: string;
  public readonly instructionVideo: string | null;
  public readonly targetMuscle: string;

  public readonly userId: string | null;
  public readonly admin: boolean;

  public readonly name: string;
  public readonly instructions: string[];

  constructor({
    id,
    name,
    avatarUrl,
    avatarSecondaryUrl,
    equipment,
    exerciseType,
    instructionVideo,
    targetMuscle,
    instructions,
    userId,
    admin,
  }: WithId<ExerciseResponseDto['baseData']> & ExerciseTranslationResponse) {
    this.id = id;
    this.name = name;
    this.avatarUrl = avatarUrl;
    this.avatarSecondaryUrl = avatarSecondaryUrl;
    this.equipment = equipment;
    this.exerciseType = exerciseType;
    this.instructionVideo = instructionVideo;
    this.targetMuscle = targetMuscle;
    this.instructions = instructions;
    this.userId = userId;
    this.admin = admin;
  }
}
