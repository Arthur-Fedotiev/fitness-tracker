import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkoutBasicInfoComponent } from './workout-basic-info.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@fitness-tracker/shared-ui-material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [WorkoutBasicInfoComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    FlexLayoutModule,
    TranslateModule,
  ],
  exports: [WorkoutBasicInfoComponent],
})
export class WorkoutBasicInfoModule {}
