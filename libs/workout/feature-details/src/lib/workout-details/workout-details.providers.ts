import { importProvidersFrom } from '@angular/core';

import { translationsLoaderFactory } from '@fitness-tracker/shared/utils';
import { HttpClient } from '@angular/common/http';
import { MissingTranslationService } from '@fitness-tracker/shared/i18n';
import {
  TranslateModule,
  TranslateLoader,
  MissingTranslationHandler,
} from '@ngx-translate/core';

const i18nAssetsPath = 'assets/i18n/workout-details/';

export const workoutDetailsProviders = [
  importProvidersFrom(
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
  ),
];
