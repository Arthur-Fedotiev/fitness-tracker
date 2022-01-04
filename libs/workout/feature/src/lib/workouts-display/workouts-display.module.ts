import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkoutsDisplayComponent } from './workouts-display.component';
import { WorkoutUiModule } from '@fitness-tracker/workout/ui';
import { WorkoutDisplayRoutingModule } from './workout-display-routing.module';

@NgModule({
  declarations: [WorkoutsDisplayComponent],
  imports: [CommonModule, WorkoutUiModule, WorkoutDisplayRoutingModule],
  exports: [WorkoutsDisplayComponent],
})
export class WorkoutsDisplayModule {}
