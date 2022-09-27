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
import { WorkoutComposeWorkoutUtilsModule } from '@fitness-tracker/workout-compose-workout-utils';

@NgModule({
  declarations: [WorkoutsDisplayComponent],
  imports: [
    CommonModule,
    WorkoutUiModule,
    WorkoutDisplayRoutingModule,
    WorkoutFiltersModule,
    RouterModule,
    TranslateModule,
    WorkoutComposeWorkoutUtilsModule,
  ],
  exports: [WorkoutsDisplayComponent],
})
export class WorkoutsDisplayModule {}
