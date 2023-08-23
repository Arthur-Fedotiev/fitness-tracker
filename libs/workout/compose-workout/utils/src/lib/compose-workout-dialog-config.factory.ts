import { InjectionToken, Type } from '@angular/core';
import { MatDialogConfig } from '@angular/material/dialog';

export interface WorkoutBasicInfo {
  name: string;
  id?: string;
  targetMuscles: string[];
  importantNotes: string;
  description: string;
  coverUrl: string;
  avatarUrl: string;
  level: string;
}

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
