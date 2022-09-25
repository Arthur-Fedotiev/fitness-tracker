import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkoutItemRestComponent } from './workout-item-rest.component';
import { MaterialModule } from '@fitness-tracker/shared-ui-material';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [WorkoutItemRestComponent],
  imports: [CommonModule, MaterialModule, FormsModule],
  exports: [WorkoutItemRestComponent],
})
export class WorkoutItemRestModule {}
