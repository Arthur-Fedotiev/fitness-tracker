import { Pagination } from '@fitness-tracker/shared/utils';

export const MUSCLE_LIST_FULL = [
  'Neck',
  'Traps (trapezius)',
  'Shoulders (deltoids)',
  'Chest (pectoralis)',
  'Biceps (biceps brachii)',
  'Forearm (brachioradialis)',
  'Abs (rectus abdominis)',
  'Quads (quadriceps)',
  'Calves (gastrocnemius)',
  'Traps (trapezius)',
  'Triceps (triceps brachii)',
  'Lats (latissimus dorsi)',
  'Middle Back (rhomboids)',
  'Lower Back',
  'Glutes(gluteus maximus and medius)',
  'Quads (quadriceps)',
  'Hamstrings (biceps femoris)',
  'Calves (gastrocnemius)',
] as const;

export const MUSCLE_LIST = [
  'neck',
  'traps',
  'shoulders',
  'chest',
  'biceps',
  'forearm',
  'abdominal',
  'quadriceps',
  'calves',
  'triceps',
  'lats',
  'middle back',
  'lower back',
  'glutes',
  'hamstrings',
] as const;

export const MUSCLE_KEYS = [
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

export const EQUIPMENT = [
  'Bands',
  'Foam Roll',
  'Barbell',
  'Kettlebells',
  'Body Only',
  'Machine',
  'Cable',
  'Medicine Ball',
  'Dumbbell',
  'None',
  'E-Z Curl Bar',
  'Other',
  'Exercise Ball',
] as const;

export const EQUIPMENT_KEYS = [
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

export const EXERCISE_TYPES = [
  'Cardio',
  'Olympic Weightlifting',
  'Plyometrics',
  'Powerlifting',
  'Strength',
  'Stretching',
  'Strongman',
] as const;

export const EXERCISE_TYPE_KEYS = [
  'CARDIO',
  'WEIGHTLIFTING',
  'PLYOMETRICS',
  'POWERLIFTING',
  'STRENGTH',
  'STRETCHING',
  'STRONGMAN',
] as const;

export const PROFICIENCY_TYPE_KEYS = [
  'BEGINNER',
  'INTERMEDIATE',
  'ADVANCED',
] as const;

export const META_COLLECTIONS = {
  muscles: MUSCLE_KEYS,
  equipment: EQUIPMENT_KEYS,
  'exercise-types': EXERCISE_TYPE_KEYS,
  proficiencyLvl: PROFICIENCY_TYPE_KEYS,
} as const;

export interface SearchOptions extends Pagination {
  sortOrder: 'desc' | 'asc';
  ids: string[];
  targetMuscles: TargetMuscles;
}

export type TargetMuscles = typeof MUSCLE_KEYS[number][];
