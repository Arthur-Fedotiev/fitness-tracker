import { HttpClient } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import {
  ExerciseDetailsDialogComponent,
  EXERCISE_DESCRIPTORS_PROVIDER,
  EXERCISE_DOMAIN_PROVIDERS,
} from '@fitness-tracker/exercise/domain';
import { MissingTranslationService } from '@fitness-tracker/shared/i18n';
import { translationsLoaderFactory } from '@fitness-tracker/shared/utils';
import {
  TranslateModule,
  TranslateLoader,
  MissingTranslationHandler,
} from '@ngx-translate/core';
import { from, map } from 'rxjs';

const i18nAssetsPath = 'assets/i18n/exercise-display/';

export const DISPLAY_PAGE_PROVIDERS = [
  EXERCISE_DESCRIPTORS_PROVIDER,
  EXERCISE_DOMAIN_PROVIDERS,
  {
    provide: ExerciseDetailsDialogComponent,
    useFactory: () =>
      from(import('@fitness-tracker/exercise/ui-components')).pipe(
        map((module) => module.ExerciseDetailsComponent),
      ),
  },
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
