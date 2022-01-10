import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkoutFiltersComponent } from './workout-filters.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@fitness-tracker/shared-ui-material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [WorkoutFiltersComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    FlexLayoutModule,
    TranslateModule,
  ],
  exports: [WorkoutFiltersComponent],
})
export class WorkoutFiltersModule {}
