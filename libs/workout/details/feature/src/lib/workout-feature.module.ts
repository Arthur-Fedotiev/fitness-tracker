import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WorkoutRoutingModule } from './workout-routing.module';
import { WorkoutsDisplayModule } from './workouts-display/workouts-display.module';
import { WorkoutDataModule } from '@fitness-tracker/workout/data';

@NgModule({
  imports: [
    CommonModule,
    WorkoutRoutingModule,
    WorkoutsDisplayModule,
    WorkoutDataModule,
],
})
export class WorkoutFeatureModule {}
