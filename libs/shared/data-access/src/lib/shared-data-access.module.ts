import { ModuleWithProviders, NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { languageMetaReducer } from './+state/meta-reducers/language-meta-reducer.reducer';
import { environment } from '@fitness-tracker/shared/environments';
import { appReduceMap, FtState } from './+state/reducers/app.reduce-map';

import {
  provideAuth,
  connectAuthEmulator,
  getAuth,
  AuthModule,
} from '@angular/fire/auth';

import {
  connectFunctionsEmulator,
  FunctionsModule,
  getFunctions,
  provideFunctions,
} from '@angular/fire/functions';

import {
  ScreenTrackingService,
  UserTrackingService,
} from '@angular/fire/analytics';
import { SettingsEffects } from './+state/effects/settings.effects';
import { darkMode } from './+state/meta-reducers/dark-mode.reducer';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import {
  connectFirestoreEmulator,
  getFirestore,
  initializeFirestore,
  persistentLocalCache,
  provideFirestore,
} from '@angular/fire/firestore';

@NgModule({
  imports: [
    StoreModule.forRoot<FtState>(appReduceMap, {
      metaReducers: [languageMetaReducer, darkMode],
      runtimeChecks: {
        strictActionImmutability: true,
        strictStateImmutability: true,
      },
    }),
    EffectsModule.forRoot([SettingsEffects]),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    FunctionsModule,
    AuthModule,

    provideAuth(() => {
      const auth = getAuth();
      if (environment.useEmulators) {
        connectAuthEmulator(auth, 'http://localhost:9099', {
          disableWarnings: true,
        });
      }

      return auth;
    }),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => {
      const firestore = getFirestore();

      // local cache

      if (environment.useEmulators) {
        connectFirestoreEmulator(firestore, 'localhost', 8080);
      }

      // initializeFirestore(firestore.app, {
      //   localCache: persistentLocalCache(),
      // });

      return firestore;
    }),
    provideFunctions(() => {
      const functions = getFunctions();
      if (environment.useEmulators) {
        connectFunctionsEmulator(functions, 'localhost', 5001);
      }
      return functions;
    }),
  ],
  providers: [ScreenTrackingService, UserTrackingService],
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
