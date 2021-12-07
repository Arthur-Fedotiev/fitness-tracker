import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExerciseComponent } from './exercise/exercise.component';
import { MaterialModule } from '@fitness-tracker/shared-ui-material';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ExerciseListComponent } from './exercise-list/exercise-list.component';
import { ImgFallbackModule } from "@fitness-tracker/shared/utils";
@NgModule({
  imports: [CommonModule, MaterialModule, RouterModule, FlexLayoutModule, ImgFallbackModule],
  declarations: [ExerciseComponent, ExerciseListComponent],
  exports: [ExerciseComponent, ExerciseListComponent]
})
export class ExercisesUiModule { }
