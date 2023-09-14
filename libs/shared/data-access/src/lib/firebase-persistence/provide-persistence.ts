import { Injector, importProvidersFrom } from '@angular/core';
import { provideAuth, getAuth, connectAuthEmulator } from '@angular/fire/auth';
import {
  provideFirestore,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  connectFirestoreEmulator,
} from '@angular/fire/firestore';
import {
  provideFunctions,
  getFunctions,
  connectFunctionsEmulator,
} from '@angular/fire/functions';
import {
  FirebaseApp,
  FirebaseOptions,
  initializeApp,
  provideFirebaseApp,
} from '@angular/fire/app';

interface ProvidePersistenceSettings {
  useEmulators: boolean;
  firebase: FirebaseOptions;
}

export const providePersistence = ({
  useEmulators,
  firebase,
}: ProvidePersistenceSettings) => [
  importProvidersFrom(
    provideAuth(() => {
      const auth = getAuth();

      if (useEmulators) {
        connectAuthEmulator(auth, 'http://localhost:9099', {
          disableWarnings: true,
        });
      }

      return auth;
    }),
    provideFirebaseApp(() => initializeApp(firebase)),
    provideFirestore((injector: Injector) => {
      const firestore = initializeFirestore(injector.get(FirebaseApp), {
        localCache: persistentLocalCache({
          tabManager: persistentMultipleTabManager(),
        }),
      });

      if (useEmulators) {
        connectFirestoreEmulator(firestore, 'localhost', 8080);
      }

      return firestore;
    }),
    provideFunctions(() => {
      const functions = getFunctions();
      if (useEmulators) {
        connectFunctionsEmulator(functions, 'localhost', 5001);
      }
      return functions;
    }),
  ),
];
