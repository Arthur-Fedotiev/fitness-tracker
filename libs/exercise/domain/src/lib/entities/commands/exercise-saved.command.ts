import { InjectionToken } from '@angular/core';
import { CreateUpdateExerciseRequestDTO } from '../dto/request/update/exercise-create-update-request.dto';

export interface ExerciseSavedCommand {
  exerciseSaved(exercise: CreateUpdateExerciseRequestDTO): void;
}

export const EXERCISE_SAVED_COMMAND = new InjectionToken<ExerciseSavedCommand>(
  'ExerciseSavedCommand',
);
