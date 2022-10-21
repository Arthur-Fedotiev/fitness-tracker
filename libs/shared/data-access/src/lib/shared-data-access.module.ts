import { ModuleWithProviders, NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { languageMetaReducer } from './+state/meta-reducers/language-meta-reducer.reducer';
import { environment } from '@fitness-tracker/shared/environments';
import { appReduceMap, FtState } from './+state/reducers/app.reduce-map';
import { AngularFireModule } from '@angular/fire/compat';
import { FirebaseUIModule } from 'firebaseui-angular';
import { firebaseUiAuthConfig } from './firebase/firebase-auth-ui-config';

import {
  AngularFirestoreModule,
  USE_EMULATOR as USE_FIRESTORE_EMULATOR,
} from '@angular/fire/compat/firestore';
import { USE_EMULATOR as USE_FUNCTIONS_EMULATOR } from '@angular/fire/compat/functions';
import { USE_EMULATOR as USE_AUTH_EMULATOR } from '@angular/fire/compat/auth';

import {
  ScreenTrackingService,
  UserTrackingService,
} from '@angular/fire/analytics';
import { SettingsEffects } from './+state/effects/settings.effects';
import { darkMode } from './+state/meta-reducers/dark-mode.reducer';

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
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule.enablePersistence(),
    FirebaseUIModule.forRoot(firebaseUiAuthConfig),
    AngularFirestoreModule,
  ],
  providers: [
    ScreenTrackingService,
    UserTrackingService,
    {
      provide: USE_FIRESTORE_EMULATOR,
      useValue: environment.useEmulators
        ? ['http://localhost:8080']
        : undefined,
    },
    {
      provide: USE_FUNCTIONS_EMULATOR,
      useValue: environment.useEmulators
        ? ['http://localhost:5001']
        : undefined,
    },
    {
      provide: USE_AUTH_EMULATOR,
      useValue: environment.useEmulators
        ? ['http://127.0.0.1:9099']
        : undefined,
    },
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
