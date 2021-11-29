import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateExerciseComponent } from './create-exercise.component';
import { MaterialModule } from '@fitness-tracker/shared-ui-material';
import { ReactiveFormsModule } from '@angular/forms';
import { CreateExerciseRoutingModule } from './create-exercise-routing.module';
import { FlexLayoutModule } from '@angular/flex-layout';



@NgModule({
  declarations: [CreateExerciseComponent],
  imports: [
    CommonModule,
    CreateExerciseRoutingModule,
    MaterialModule,
    FlexLayoutModule,
    ReactiveFormsModule
  ]
})
export class CreateExerciseModule { }
