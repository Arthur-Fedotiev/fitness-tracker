import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateUpdateExerciseRequestDTO } from '../dto/request/update/exercise-create-update-request.dto';

export interface ExerciseSavedCommand {
  exerciseSaved(exercise: CreateUpdateExerciseRequestDTO): Observable<any>;
}

export const EXERCISE_SAVED_COMMAND = new InjectionToken<ExerciseSavedCommand>(
  'ExerciseSavedCommand',
);
