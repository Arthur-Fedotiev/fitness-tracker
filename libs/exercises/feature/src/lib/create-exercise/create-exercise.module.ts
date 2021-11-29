import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateExerciseComponent } from './create-exercise.component';
import { MaterialModule } from '@fitness-tracker/shared-ui-material';
import { ReactiveFormsModule } from '@angular/forms';
import { CreateExerciseRoutingModule } from './create-exercise-routing.module';



@NgModule({
  declarations: [CreateExerciseComponent],
  imports: [
    CommonModule,
    CreateExerciseRoutingModule,
    MaterialModule,
    ReactiveFormsModule
  ]
})
export class CreateExerciseModule { }
