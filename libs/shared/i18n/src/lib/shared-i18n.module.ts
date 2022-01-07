import { ModuleWithProviders, NgModule } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  MissingTranslationHandler,
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import { MissingTranslationService } from './services/missing-translation.service';
import { translationsLoaderFactory } from '@fitness-tracker/shared/utils';

const i18nGlobalPath = './assets/i18n/';

@NgModule({
  imports: [
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
      // useDefaultLang: false,
      isolate: false,
      extend: true,
    }),
  ],
})
export class SharedI18nModule {}

@NgModule({})
export class SharedI18nRootModule {
  static forRoot(): ModuleWithProviders<SharedI18nModule> {
    return {
      ngModule: SharedI18nModule,
    };
  }
}
