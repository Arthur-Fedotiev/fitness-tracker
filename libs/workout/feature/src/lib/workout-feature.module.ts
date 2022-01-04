import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkoutPageModule } from './workout-page/workout-page.module';
import { WorkoutRoutingModule } from './workout-routing.module';
import { WorkoutsDisplayModule } from './workouts-display/workouts-display.module';
import { WorkoutDataModule } from '@fitness-tracker/workout/data';

@NgModule({
  imports: [
    CommonModule,
    WorkoutRoutingModule,
    WorkoutPageModule,
    WorkoutsDisplayModule,
    WorkoutDataModule,
  ],
})
export class WorkoutFeatureModule {}
