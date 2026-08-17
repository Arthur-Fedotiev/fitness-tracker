import { InjectionToken } from '@angular/core';

export interface LoadExercisePickerListCommand {
  loadExercisePickerList(): void;
}

export const LOAD_EXERCISE_PICKER_LIST_COMMAND = new InjectionToken<LoadExercisePickerListCommand>(
  'LoadExercisePickerListCommand',
);
