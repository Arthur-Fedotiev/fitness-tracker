import { ModuleWithProviders, NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { environment } from 'apps/fitness-tracker/src/environments/environment';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { languageMetaReducer } from './meta-reducers/language-meta-reducer.reducer';
import { appReduceMap } from './app.reduce-map';
import { FtState } from '@fitness-tracker/shared/utils';

@NgModule({
  imports: [
    StoreModule.forRoot<FtState>(appReduceMap, {
      metaReducers: !environment.production
        ? [languageMetaReducer]
        : [languageMetaReducer],
      runtimeChecks: {
        strictActionImmutability: true,
        strictStateImmutability: true,
      },
    }),
    EffectsModule.forRoot([]),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
  ],
})
export class SharedDataAccessRootModule {}

@NgModule({})
export class SharedDataAccessModule {
  static forRoot(): ModuleWithProviders<SharedDataAccessRootModule> {
    return {
      ngModule: SharedDataAccessRootModule,
    };
  }
}
