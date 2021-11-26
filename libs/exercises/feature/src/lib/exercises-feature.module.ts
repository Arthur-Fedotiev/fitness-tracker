import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExerciseEditModalComponent } from './exercise-edit-modal/exercise-edit-modal.component';
import { ExercisesPageComponent } from './exercises-page/exercises-page.component';
import { ExercisesFeatureRoutingModule } from './exercises-feature-routing.module';
import { CreateExerciseComponent } from './create-exercise/create-exercise.component';
import { MaterialModule } from '@fitness-tracker/shared-ui-material';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    ExercisesFeatureRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
  ],
  declarations: [
    ExerciseEditModalComponent,
    ExercisesPageComponent,
    CreateExerciseComponent,
  ],
  exports: [ExercisesPageComponent],
})
export class ExercisesFeatureModule {}
