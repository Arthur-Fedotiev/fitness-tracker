import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkoutDetailsComponent } from './workout-details.component';
import { WorkoutDetailsRoutingModule } from './workout-details-routing.module';
import { MaterialModule } from '@fitness-tracker/shared-ui-material';
import { ImgFallbackModule } from '@fitness-tracker/shared/utils';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ExerciseDetailsModule } from '@fitness-tracker/shared/dialogs';
import { ExercisesDataModule } from '@fitness-tracker/exercises/data';

@NgModule({
  declarations: [WorkoutDetailsComponent],
  imports: [
    CommonModule,
    WorkoutDetailsRoutingModule,
    MaterialModule,
    ImgFallbackModule,
    FlexLayoutModule,
    ExerciseDetailsModule,
    ExercisesDataModule,
  ],
  exports: [WorkoutDetailsComponent],
})
export class WorkoutDetailsModule {}
