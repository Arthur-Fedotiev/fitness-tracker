import { InjectionToken } from '@angular/core';

export interface OpenExerciseDetailsDialogCommand {
  openExerciseDetailsDialog(id: string): void;
}

export const OPEN_EXERCISE_DETAILS_DIALOG_COMMAND =
  new InjectionToken<OpenExerciseDetailsDialogCommand>(
    'OpenExerciseDetailsDialogCommand',
  );
