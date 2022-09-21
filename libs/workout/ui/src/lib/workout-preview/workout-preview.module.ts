import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkoutPreviewComponent } from './workout-preview.component';
import { MaterialModule } from '@fitness-tracker/shared-ui-material';
import { RouterModule } from '@angular/router';
import { ImgFallbackModule } from '@fitness-tracker/shared/utils';
import { TranslateModule } from '@ngx-translate/core';
import { RolesModule } from '@fitness-tracker/auth/feature';

@NgModule({
  declarations: [WorkoutPreviewComponent],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    ImgFallbackModule,
    TranslateModule,
    RolesModule,
  ],
  exports: [WorkoutPreviewComponent],
})
export class WorkoutPreviewModule {}
