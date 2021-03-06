import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComposeWorkoutComponent } from './compose-workout.component';
import { MaterialModule } from '@fitness-tracker/shared-ui-material';
import { FormsModule } from '@angular/forms';
import { WorkoutItemLoadSubformModule } from './components/workout-item-load-subform/workout-item-load-subform.module';
import { WorkoutItemRestModule } from './components/workout-item-rest/workout-item-rest.module';
import { WorkoutBasicInfoModule } from './components/workout-basic-info/workout-basic-info.module';

@NgModule({
  declarations: [ComposeWorkoutComponent],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    WorkoutItemLoadSubformModule,
    WorkoutItemRestModule,
    WorkoutBasicInfoModule,
  ],
  exports: [ComposeWorkoutComponent],
})
export class ComposeWorkoutModule {}
