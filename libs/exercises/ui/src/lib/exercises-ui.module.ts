import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateExerciseComponent } from './create-exercise/create-exercise.component';
import { ExerciseComponent } from './exercise/exercise.component';
import { ExerciseListComponent } from './exercise-list/exercise-list.component';
import { MaterialModule } from '@fitness-tracker/material';

@NgModule({
  imports: [CommonModule, MaterialModule],
  declarations: [
    CreateExerciseComponent,
    ExerciseComponent,
    ExerciseListComponent
  ],
  exports: [
    CreateExerciseComponent,
    ExerciseComponent,
    ExerciseListComponent
  ],
})
export class ExercisesUiModule { }
