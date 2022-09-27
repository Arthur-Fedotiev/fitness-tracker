import { NgModule } from '@angular/core';
import { SerializerStrategy } from '@fitness-tracker/shared/utils';
import { ConcreteWorkoutItemSerializer } from '@fitness-tracker/workout/data';
import { COMPOSE_WORKOUT_DIALOG_FACTORY } from './compose-workout-dialog-config.factory';
import { CreateComposeWorkoutDialog } from './create-dialog.factory';

@NgModule({
  providers: [
    {
      provide: SerializerStrategy,
      useExisting: ConcreteWorkoutItemSerializer,
    },
    {
      provide: COMPOSE_WORKOUT_DIALOG_FACTORY,
      useClass: CreateComposeWorkoutDialog,
    },
  ],
})
export class WorkoutComposeWorkoutUtilsModule {}
