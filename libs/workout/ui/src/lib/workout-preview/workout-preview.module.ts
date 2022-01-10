import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkoutPreviewComponent } from './workout-preview.component';
import { MaterialModule } from '@fitness-tracker/shared-ui-material';
import { RouterModule } from '@angular/router';
import { ImgFallbackModule, LanguagesISO } from '@fitness-tracker/shared/utils';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [WorkoutPreviewComponent],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    ImgFallbackModule,
    TranslateModule,
  ],
  exports: [WorkoutPreviewComponent],
})
export class WorkoutPreviewModule {}
