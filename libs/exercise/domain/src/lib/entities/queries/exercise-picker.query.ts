import { InjectionToken, Signal } from '@angular/core';
import { ExerciseResponseModel } from '../../application/models/exercise-response.model';

/** A narrow `{id, name}` projection of the exercise list, for a name-filtered picker dropdown. */
export interface ExercisePickerQuery {
  exercisePickerList: Signal<Array<Pick<ExerciseResponseModel, 'id' | 'name'>>>;
}

export const EXERCISE_PICKER_QUERY = new InjectionToken<ExercisePickerQuery>('ExercisePickerQuery');
