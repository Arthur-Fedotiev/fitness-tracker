import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkoutItemLoadSubformComponent } from './workout-item-load-subform.component';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '@fitness-tracker/shared-ui-material';

@NgModule({
  declarations: [WorkoutItemLoadSubformComponent],
  imports: [CommonModule, FormsModule, MaterialModule],
  exports: [WorkoutItemLoadSubformComponent],
})
export class WorkoutItemLoadSubformModule {}
