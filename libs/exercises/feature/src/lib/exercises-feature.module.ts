import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExerciseEditModalComponent } from './exercise-edit-modal/exercise-edit-modal.component';
import { ExercisesPageComponent } from './exercises-page/exercises-page.component';

@NgModule({
  imports: [CommonModule],
  declarations: [
    ExerciseEditModalComponent,
    ExercisesPageComponent
  ],
  exports: [
    ExercisesPageComponent
  ],
})
export class ExercisesFeatureModule {}
