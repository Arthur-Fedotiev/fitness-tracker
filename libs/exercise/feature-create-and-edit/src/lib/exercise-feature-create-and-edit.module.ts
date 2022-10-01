import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ExerciseDomainModule,
  EXERCISE_DESCRIPTORS_PROVIDER,
} from '@fitness-tracker/exercise/domain';
import { CreateAndEditComponent } from './create-and-edit.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@fitness-tracker/shared-ui-material';
import { TranslateModule } from '@ngx-translate/core';
import { CreateAndEditExerciseRoutingModule } from './create-exercise-routing.module';

@NgModule({
  imports: [
    CommonModule,
    CreateAndEditExerciseRoutingModule,
    ExerciseDomainModule,
    MaterialModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    TranslateModule,
  ],
  declarations: [CreateAndEditComponent],
  providers: [EXERCISE_DESCRIPTORS_PROVIDER],
})
export class ExerciseFeatureCreateAndEditModule {}
