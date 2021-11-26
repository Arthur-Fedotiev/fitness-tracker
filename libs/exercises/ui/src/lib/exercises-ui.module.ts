import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExerciseComponent } from './exercise/exercise.component';
import { MaterialModule } from '@fitness-tracker/shared-ui-material';

@NgModule({
  imports: [CommonModule, MaterialModule],
  declarations: [ExerciseComponent],
  exports: [ExerciseComponent],
})
export class ExercisesUiModule {}
