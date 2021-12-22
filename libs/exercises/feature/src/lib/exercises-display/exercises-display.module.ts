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
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { environment } from '@fitness-tracker/shared/environments';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(
    http,
    'assets/i18n/exercises-display/',
    '.json',
  );
}

@NgModule({
  declarations: [ExercisesDisplayComponent],
  imports: [
    CommonModule,
    ExercisesDisplayRoutingModule,
    ExercisesUiModule,
    FlexLayoutModule,
    MaterialModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
      missingTranslationHandler: {
        provide: MissingTranslationHandler,
        useClass: MissingTranslationService,
      },
      isolate: true,
      extend: false,
      defaultLanguage: environment.defaultLocale,
    }),
  ],
})
export class ExercisesDisplayModule {}
