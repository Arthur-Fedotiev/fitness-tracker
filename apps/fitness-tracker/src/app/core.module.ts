import { importProvidersFrom } from '@angular/core';
import { LayoutFeatureModule } from '@fitness-tracker/layout/feature';
import { SharedDataAccessModule } from '@fitness-tracker/shared/data-access';
import { MissingTranslationService } from '@fitness-tracker/shared/i18n';
import {
  MissingTranslationHandler,
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import { SharedRootPwaModule } from '@fitness-tracker/shared/pwa';
import { HttpClient } from '@angular/common/http';
import { translationsLoaderFactory } from '@fitness-tracker/shared/utils';
import { authProviders } from '@fitness-tracker/auth/shell';

const i18nGlobalPath = 'assets/i18n/';
let isCoreDependenciesRegistered = false;

export const provideCoreDependencies = () => {
  if (isCoreDependenciesRegistered) {
    throw new Error('Core dependencies have already been registered.');
  }

  isCoreDependenciesRegistered = true;

  return [
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
    importProvidersFrom(SharedRootPwaModule.forRoot()),
    importProvidersFrom(SharedDataAccessModule.forRoot()),
    importProvidersFrom(LayoutFeatureModule.forRoot()),
    authProviders,
  ];
};
