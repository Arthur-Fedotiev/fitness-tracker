import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExerciseDomainModule } from '@fitness-tracker/exercise/domain';
import { CreateAndEditComponent } from './create-and-edit.component';

@NgModule({
  imports: [CommonModule, ExerciseDomainModule],
  declarations: [CreateAndEditComponent],
  exports: [CreateAndEditComponent],
})
export class ExerciseFeatureCreateAndEditModule {}
