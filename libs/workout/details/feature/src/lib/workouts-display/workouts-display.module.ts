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
import { EXERCISE_DESCRIPTORS_PROVIDER } from '@fitness-tracker/exercise/api-public';

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
  providers: [EXERCISE_DESCRIPTORS_PROVIDER],
  exports: [WorkoutsDisplayComponent],
})
export class WorkoutsDisplayModule {}
