import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkoutBasicInfoComponent } from './workout-basic-info.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@fitness-tracker/shared-ui-material';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  declarations: [WorkoutBasicInfoComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    FlexLayoutModule,
  ],
  exports: [WorkoutBasicInfoComponent],
})
export class WorkoutBasicInfoModule {}
