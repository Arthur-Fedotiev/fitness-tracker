import { InjectionToken, Type } from '@angular/core';
import { MatDialogConfig } from '@angular/material/dialog';
import { WorkoutBasicInfo } from '@fitness-tracker/workout/data';

export type WorkoutExercise = {
  readonly id: string;
  readonly name: string;
};

export interface ComposeWorkoutDialogFactory {
  createDialog(
    workoutExercisesList: WorkoutExercise[],
    workoutBasicInfo?: WorkoutBasicInfo,
  ): {
    config: MatDialogConfig;
    component: Type<unknown>;
  };
}

export const COMPOSE_WORKOUT_DIALOG_FACTORY =
  new InjectionToken<ComposeWorkoutDialogFactory>(
    'ComposeWorkoutDialogFactory',
  );
