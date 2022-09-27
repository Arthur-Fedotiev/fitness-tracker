import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExerciseDomainModule } from '@fitness-tracker/exercise/domain';
import { DisplayComponent } from './display.component';

@NgModule({
  imports: [CommonModule, ExerciseDomainModule],
  declarations: [DisplayComponent],
  exports: [DisplayComponent],
})
export class ExerciseFeatureDisplayModule {}
