import { importProvidersFrom } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { SettingsEffects } from './effects/settings.effects';
import { provideStoreDevtools } from './devtools.providers';
import { darkMode } from './meta-reducers/dark-mode.reducer';
import { FtState, appReduceMap } from './reducers/app.reduce-map';

export const provideSharedState = () => [
  importProvidersFrom(
    StoreModule.forRoot<FtState>(appReduceMap, {
      metaReducers: [darkMode],
      runtimeChecks: {
        strictActionImmutability: true,
        strictStateImmutability: true,
      },
    }),
    EffectsModule.forRoot([SettingsEffects]),
  ),
  provideStoreDevtools(),
];
