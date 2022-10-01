import { InjectionToken } from '@angular/core';

export interface LoadExerciseDetailsCommand {
  loadExerciseDetails(id: string): void;
}

export const LOAD_EXERCISE_DETAILS_COMMAND =
  new InjectionToken<LoadExerciseDetailsCommand>('LoadExerciseDetailsCommand');
