import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExerciseDetailsRoutingModule } from './exercise-details-routing.module';
import { ExerciseDetailsComponent } from './exercise-details.component';
import { MaterialModule } from '@fitness-tracker/shared-ui-material';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  declarations: [ExerciseDetailsComponent],
  imports: [
    CommonModule,
    ExerciseDetailsRoutingModule,
    MaterialModule,
    FlexLayoutModule,
  ],
  exports: [ExerciseDetailsComponent],
})
export class ExerciseDetailsModule {}
