import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkoutDetailsComponent } from './workout-details.component';
import { WorkoutDetailsRoutingModule } from './workout-details-routing.module';
import { MaterialModule } from '@fitness-tracker/shared-ui-material';
import {
  ImgFallbackModule,
  translationsLoaderFactory,
} from '@fitness-tracker/shared/utils';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ExerciseDetailsModule } from '@fitness-tracker/shared/dialogs';
import { ExercisesDataModule } from '@fitness-tracker/exercises/data';
import { HttpClient } from '@angular/common/http';
import { MissingTranslationService } from '@fitness-tracker/shared/i18n';
import {
  TranslateModule,
  TranslateLoader,
  MissingTranslationHandler,
} from '@ngx-translate/core';

const i18nAssetsPath = 'assets/i18n/workout-details/';

@NgModule({
  declarations: [WorkoutDetailsComponent],
  imports: [
    CommonModule,
    WorkoutDetailsRoutingModule,
    MaterialModule,
    ImgFallbackModule,
    FlexLayoutModule,
    ExerciseDetailsModule,
    ExercisesDataModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: translationsLoaderFactory(i18nAssetsPath),
        deps: [HttpClient],
      },
      missingTranslationHandler: {
        provide: MissingTranslationHandler,
        useClass: MissingTranslationService,
      },
      isolate: false,
      extend: true,
    }),
  ],
})
export class WorkoutDetailsModule {}
