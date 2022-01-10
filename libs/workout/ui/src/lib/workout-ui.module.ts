import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkoutListModule } from './workout-list/workout-list.module';
import { WorkoutPreviewModule } from './workout-preview/workout-preview.module';
import { LanguagesISO } from '@fitness-tracker/shared/utils';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    WorkoutListModule,
    WorkoutPreviewModule,
    WorkoutPreviewModule,
  ],
  exports: [WorkoutListModule, WorkoutPreviewModule],
})
export class WorkoutUiModule {}
