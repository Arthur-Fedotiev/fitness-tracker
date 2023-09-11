import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { ExerciseResponseModel } from '../../application/models/exercise-response.model';

export interface ExerciseDetailsQuery {
  selectedExerciseDetails$: Observable<ExerciseResponseModel | null>;
}

export const EXERCISE_DETAILS_QUERY = new InjectionToken<ExerciseDetailsQuery>(
  'ExerciseDetailsQuery',
);
