import { attachCustomCommands } from 'cypress-firebase';
import { environment } from '@fitness-tracker/shared/environments';
import { clickOutside, dataCy, selectLanguage, selectMatOption } from './utils';
import { initializeApp } from '@angular/fire/app';

// eslint-disable-next-line @typescript-eslint/no-namespace
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable<Subject> {
      dataCy: typeof dataCy;
      selectLanguage: typeof selectLanguage;
      clickOutside: typeof clickOutside;
      selectMatOption: typeof selectMatOption;
    }
  }
}

Cypress.Commands.addAll({
  dataCy,
  selectLanguage,
  clickOutside,
  selectMatOption,
});

initializeApp(environment.firebase);

if (Cypress.env('IS_EMULATORS_ENABLED')) {
  const firestoreEmulatorHost = Cypress.env('FIRESTORE_EMULATOR_HOST');

  if (firestoreEmulatorHost) {
    //  firestore().settings({
    //     host: firestoreEmulatorHost,
    //     experimentalForceLongPolling: true,
    //     ssl: false,
    //   });
  }

  const authEmulatorHost = Cypress.env('FIREBASE_AUTH_EMULATOR_HOST');
  if (authEmulatorHost) {
    //  auth().useEmulator(`${authEmulatorHost}`);
  }
}

// attachCustomCommands({ Cypress, cy, firebase });
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
