import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComposeWorkoutComponent } from './compose-workout.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MaterialModule } from '@fitness-tracker/shared-ui-material';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [ComposeWorkoutComponent],
  imports: [CommonModule, FormsModule, MaterialModule],
  exports: [ComposeWorkoutComponent],
})
export class ComposeWorkoutModule {}
