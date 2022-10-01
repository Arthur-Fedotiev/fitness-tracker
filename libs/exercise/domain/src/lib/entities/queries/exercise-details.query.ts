import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { ExerciseResponseDto } from '../dto/response/exercise-response.dto';

export interface ExerciseDetailsQuery {
  selectedExerciseDetails$: Observable<ExerciseResponseDto | null>;
}

export const EXERCISE_DETAILS_QUERY = new InjectionToken<ExerciseDetailsQuery>(
  'ExerciseDetailsQuery',
);
