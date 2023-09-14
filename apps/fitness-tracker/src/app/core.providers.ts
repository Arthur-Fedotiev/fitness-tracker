import { importProvidersFrom } from '@angular/core';
import { provideLayout } from '@fitness-tracker/layout/feature';
import { provideSharedDataAccess } from '@fitness-tracker/shared/data-access';
import { MissingTranslationService } from '@fitness-tracker/shared/i18n/utils';
import {
  MissingTranslationHandler,
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import { providePwa } from '@fitness-tracker/shared/pwa';
import { HttpClient } from '@angular/common/http';
import { translationsLoaderFactory } from '@fitness-tracker/shared/i18n/domain';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { provideAuthDomain } from '@fitness-tracker/auth/domain';

const i18nGlobalPath = 'assets/i18n/';

export const ensureProvidedOnceFactory = (name = 'Dependencies') => {
  let isProvided = false;

  return () => {
    if (isProvided) {
      throw new Error(`${name} can only be provided once.`);
    }

    isProvided = true;
  };
};

const coreGuard = ensureProvidedOnceFactory('Core Dependencies');

export const provideCore = () => {
  coreGuard();

  return [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        subscriptSizing: 'dynamic',
      },
    },
    importProvidersFrom(
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: translationsLoaderFactory(i18nGlobalPath),
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
    provideSharedDataAccess(),
    provideLayout(),
    provideAuthDomain(),
    providePwa(),
  ];
};
