import { InjectionToken } from '@angular/core';
import { WorkoutFacadeService } from '@fitness-tracker/workout/data';

export type WorkoutFacadeProvider = WorkoutFacadeService;

export const WorkoutFacadeProvider = new InjectionToken<WorkoutFacadeProvider>(
  'WorkoutFacade',
);
