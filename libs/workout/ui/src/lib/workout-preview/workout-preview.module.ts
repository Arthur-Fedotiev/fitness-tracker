import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkoutPreviewComponent } from './workout-preview.component';
import { MaterialModule } from '@fitness-tracker/shared-ui-material';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [WorkoutPreviewComponent],
  imports: [CommonModule, MaterialModule, RouterModule],
  exports: [WorkoutPreviewComponent],
})
export class WorkoutPreviewModule {}
