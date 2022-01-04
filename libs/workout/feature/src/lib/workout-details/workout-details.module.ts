import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkoutDetailsComponent } from './workout-details.component';
import { WorkoutDetailsRoutingModule } from './workout-details-routing.module';
import { MaterialModule } from '@fitness-tracker/shared-ui-material';
import { ImgFallbackModule } from '@fitness-tracker/shared/utils';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  declarations: [WorkoutDetailsComponent],
  imports: [
    CommonModule,
    WorkoutDetailsRoutingModule,
    MaterialModule,
    ImgFallbackModule,
    FlexLayoutModule,
  ],
  exports: [WorkoutDetailsComponent],
})
export class WorkoutDetailsModule {}
