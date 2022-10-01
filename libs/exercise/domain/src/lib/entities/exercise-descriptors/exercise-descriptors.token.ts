import { InjectionToken } from '@angular/core';

export const EXERCISE_DESCRIPTORS_TOKEN =
  new InjectionToken<ExerciseDescriptors>('EXERCISE_DESCRIPTORS_TOKEN');

export interface ExerciseDescriptors {
  muscles: string[];
  equipment: string[];
  proficiencyLvls: string[];
  exerciseTypes: string[];
}
