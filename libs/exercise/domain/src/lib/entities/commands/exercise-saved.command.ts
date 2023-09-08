import { InjectionToken } from '@angular/core';
import { SaveExerciseCommandModel } from '../../application/models/create-update-exercise.models';

export interface ExerciseSavedCommand {
  exerciseSaved(command: SaveExerciseCommandModel): void;
}

export const EXERCISE_SAVED_COMMAND = new InjectionToken<ExerciseSavedCommand>(
  'ExerciseSavedCommand',
);
