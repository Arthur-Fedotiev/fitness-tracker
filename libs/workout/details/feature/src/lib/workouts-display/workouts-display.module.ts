import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkoutsDisplayComponent } from './workouts-display.component';
import {
  WorkoutFiltersModule,
  WorkoutUiModule,
} from '@fitness-tracker/workout/ui';
import { WorkoutDisplayRoutingModule } from './workout-display-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { SerializerStrategy } from '@fitness-tracker/shared/utils';
import { ConcreteWorkoutItemSerializer } from '@fitness-tracker/workout/data';

@NgModule({
  declarations: [WorkoutsDisplayComponent],
  imports: [
    CommonModule,
    WorkoutUiModule,
    WorkoutDisplayRoutingModule,
    WorkoutFiltersModule,
    RouterModule,
    TranslateModule,
  ],
  exports: [WorkoutsDisplayComponent],
  providers: [
    {
      provide: SerializerStrategy,
      useExisting: ConcreteWorkoutItemSerializer,
    },
  ],
})
export class WorkoutsDisplayModule {}
