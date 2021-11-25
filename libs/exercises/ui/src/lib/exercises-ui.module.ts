import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExerciseComponent } from './exercise/exercise.component';
import { ExerciseListComponent } from './exercise-list/exercise-list.component';
import { MaterialModule } from '@fitness-tracker/material';

@NgModule({
  imports: [CommonModule, MaterialModule],
  declarations: [
    ExerciseComponent,
    ExerciseListComponent
  ],
  exports: [
    ExerciseComponent,
    ExerciseListComponent
  ],
})
export class ExercisesUiModule { }
