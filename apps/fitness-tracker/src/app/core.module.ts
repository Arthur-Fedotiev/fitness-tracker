import { NgModule, Optional, SkipSelf } from '@angular/core';
import { AuthFeatureModule } from '@fitness-tracker/auth/feature';
import { LayoutFeatureModule } from '@fitness-tracker/layout/feature';
import { SharedDataAccessModule } from '@fitness-tracker/shared/data-access';
import { MissingTranslationService } from '@fitness-tracker/shared/i18n';
import {
  MissingTranslationHandler,
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import { NgAisModule } from 'angular-instantsearch';
import { SharedRootPwaModule } from '@fitness-tracker/shared/pwa';
import { ExerciseShellModule } from '@fitness-tracker/exercise/shell';
import { HttpClient } from '@angular/common/http';
import { translationsLoaderFactory } from '@fitness-tracker/shared/utils';
const i18nGlobalPath = 'assets/i18n/';

export abstract class EnsureImportedOnceModule<T extends NgModule> {
  protected constructor(targetModule: T) {
    if (targetModule) {
      throw new Error(
        `${targetModule.constructor.name} has already been loaded.`,
      );
    }
  }
}

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
      isolate: false,
      extend: true,
    }),
    SharedRootPwaModule.forRoot(),
    NgAisModule.forRoot(),
    SharedDataAccessModule.forRoot(),
    ExerciseShellModule.forRoot(),
    LayoutFeatureModule.forRoot(),
    AuthFeatureModule.forRoot(),
  ],
  exports: [TranslateModule],
})
export class CoreModule extends EnsureImportedOnceModule<CoreModule> {
  public constructor(@SkipSelf() @Optional() parent: CoreModule) {
    super(parent);
  }
}
