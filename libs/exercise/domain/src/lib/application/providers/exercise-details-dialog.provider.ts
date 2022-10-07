import { InjectionToken, Type } from '@angular/core';

export const ExerciseDetailsDialogComponent = new InjectionToken<
  () => Type<unknown>
>('ExerciseDetailsDialogComponent');
