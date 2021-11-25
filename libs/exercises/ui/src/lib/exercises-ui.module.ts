import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateExerciseComponent } from './create-exercise/create-exercise.component';
import { ExerciseComponent } from './exercise/exercise.component';
import { ExerciseListComponent } from './exercise-list/exercise-list.component';

@NgModule({
  imports: [CommonModule],
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
export class ExercisesUiModule {}
