import { Injectable } from '@angular/core';
import { MatDialogConfig } from '@angular/material/dialog';
import { SerializerStrategy } from '@fitness-tracker/shared/utils';
import {
  ConcreteSingleWorkoutItemInstruction,
  WorkoutItem,
  WorkoutBasicInfo,
} from '@fitness-tracker/workout/data';
import { ComposeWorkoutComponent } from '@fitness-tracker/workout/public-api';
import {
  ComposeWorkoutDialogFactory,
  WorkoutExercise,
} from './compose-workout-dialog-config.factory';

@Injectable()
export class CreateComposeWorkoutDialog implements ComposeWorkoutDialogFactory {
  constructor(private readonly serializer: SerializerStrategy) {}

  public createDialog(
    workoutExercisesList: WorkoutExercise[],
    workoutBasicInfo?: WorkoutBasicInfo,
  ) {
    const deserializedWorkoutContent = workoutExercisesList.map((exercise) =>
      this.serializer.deserialize({
        ...exercise,
        ...new ConcreteSingleWorkoutItemInstruction(),
      }),
    );
    return {
      component: ComposeWorkoutComponent,
      config: this.getDialogConfig(
        deserializedWorkoutContent,
        workoutBasicInfo,
      ),
    };
  }

  private getDialogConfig(
    workoutContent: WorkoutItem[],
    workoutBasicInfo?: WorkoutBasicInfo,
  ) {
    return Object.assign(new MatDialogConfig(), {
      disableClose: true,
      autoFocus: true,
      minWidth: '100vw',
      minHeight: '100vh',
      height: '100%',
      data: { workoutContent, workoutBasicInfo },
    });
  }
}
