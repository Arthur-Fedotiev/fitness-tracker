import { Provider } from '@angular/core';
import {
  ExerciseDescriptors,
  EXERCISE_DESCRIPTORS_TOKEN,
} from '../../entities/exercise-descriptors/exercise-descriptors.token';

const exerciseDescriptors: ExerciseDescriptors = {
  muscles: [
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
  ],
  equipment: [
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
  ],
  exerciseTypes: [
    'CARDIO',
    'WEIGHTLIFTING',
    'PLYOMETRICS',
    'POWERLIFTING',
    'STRENGTH',
    'STRETCHING',
    'STRONGMAN',
  ],
  proficiencyLvls: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'],
};

export const EXERCISE_DESCRIPTORS_PROVIDER = {
  provide: EXERCISE_DESCRIPTORS_TOKEN,
  useValue: exerciseDescriptors,
} satisfies Provider;
