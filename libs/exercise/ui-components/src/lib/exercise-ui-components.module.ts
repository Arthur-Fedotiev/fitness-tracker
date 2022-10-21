import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { RolesModule } from '@fitness-tracker/auth/feature';
import { MaterialModule } from '@fitness-tracker/shared-ui-material';
import {
  E2eDirectiveModule,
  ImgFallbackModule,
} from '@fitness-tracker/shared/utils';
import { TranslateModule } from '@ngx-translate/core';
import { ExerciseListComponent } from './exercise-list/exercise-list.component';
import { ExerciseComponent } from './exercise/exercise.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    FlexLayoutModule,
    ImgFallbackModule,
    TranslateModule,
    RolesModule,
    NgOptimizedImage,
    E2eDirectiveModule,
  ],
  declarations: [ExerciseComponent, ExerciseListComponent],
  exports: [ExerciseComponent, ExerciseListComponent],
})
export class ExerciseUiComponentsModule {}
