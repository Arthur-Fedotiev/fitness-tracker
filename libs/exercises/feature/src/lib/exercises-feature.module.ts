import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExerciseEditModalComponent } from './exercise-edit-modal/exercise-edit-modal.component';
import { ExercisesPageComponent } from './exercises-page/exercises-page.component';
import { ExercisesFeatureRoutingModule } from './exercises-feature-routing.module';
import { CreateExerciseComponent } from './create-exercise/create-exercise.component';
import { MaterialModule } from '@fitness-tracker/shared-ui-material';
import { ReactiveFormsModule } from '@angular/forms';
import { ExercisesDataModule } from '@fitness-tracker/exercises/data';
import { ExerciseListComponent } from './exercise-list/exercise-list.component';

@NgModule({
  imports: [
    CommonModule,
    ExercisesFeatureRoutingModule,
    ExercisesDataModule,
    MaterialModule,
    ReactiveFormsModule,
  ],
  declarations: [
    ExerciseEditModalComponent,
    ExercisesPageComponent,
    CreateExerciseComponent,
    ExerciseListComponent
  ],
  exports: [ExercisesPageComponent],
})
export class ExercisesFeatureModule {}
