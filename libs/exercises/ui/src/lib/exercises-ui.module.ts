import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExerciseComponent } from './exercise/exercise.component';
import { MaterialModule } from '@fitness-tracker/shared-ui-material';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  imports: [CommonModule, MaterialModule, RouterModule, FlexLayoutModule],
  declarations: [ExerciseComponent],
  exports: [ExerciseComponent]
})
export class ExercisesUiModule { }
