import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkoutDetailsComponent } from './workout-details.component';
import { WorkoutDetailsRoutingModule } from './workout-details-routing.module';
import { MaterialModule } from '@fitness-tracker/shared-ui-material';

@NgModule({
  declarations: [WorkoutDetailsComponent],
  imports: [CommonModule, WorkoutDetailsRoutingModule, MaterialModule],
  exports: [WorkoutDetailsComponent],
})
export class WorkoutDetailsModule {}
