import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExercisesDisplayRoutingModule } from './exercises-display-routing.module';
import { ExercisesDisplayComponent } from './exercises-display.component';
import { ExercisesUiModule } from '@fitness-tracker/exercises/ui';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '@fitness-tracker/shared-ui-material';
import { HttpClient } from '@angular/common/http';
import { MissingTranslationService } from '@fitness-tracker/shared/i18n';
import {
  TranslateModule,
  TranslateLoader,
  MissingTranslationHandler,
} from '@ngx-translate/core';
import { translationsLoaderFactory } from '@fitness-tracker/shared/utils';
import { ComposeWorkoutModule } from '@fitness-tracker/shared/dialogs';
import { RolesModule } from '@fitness-tracker/auth/feature';

const i18nAssetsPath = 'assets/i18n/exercises-display/';

@NgModule({
  declarations: [ExercisesDisplayComponent],
  imports: [
    CommonModule,
    ExercisesDisplayRoutingModule,
    ExercisesUiModule,
    FlexLayoutModule,
    MaterialModule,
    ComposeWorkoutModule,
    RolesModule,
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
export class ExercisesDisplayModule {}
