import { importProvidersFrom } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { SettingsEffects } from './effects/settings.effects';
import { darkMode } from './meta-reducers/dark-mode.reducer';
import { languageMetaReducer } from './meta-reducers/language-meta-reducer.reducer';
import { FtState, appReduceMap } from './reducers/app.reduce-map';

interface ProvideSharedStateSettings {
  production: boolean;
}

export const provideSharedState = ({
  production,
}: ProvideSharedStateSettings) => [
    importProvidersFrom(
      StoreModule.forRoot<FtState>(appReduceMap, {
        metaReducers: [languageMetaReducer, darkMode],
        runtimeChecks: {
          strictActionImmutability: true,
          strictStateImmutability: true,
        },
      }),
      EffectsModule.forRoot([SettingsEffects]),
      !production ? StoreDevtoolsModule.instrument({ connectInZone: true, }) : [],
    ),
  ];
