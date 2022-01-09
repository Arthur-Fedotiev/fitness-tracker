// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { LANG_CODES } from 'shared-package';

export const environment = {
  useEmulators: true,
  locales: [...LANG_CODES],
  defaultLocale: 'en',
  firebase: {
    projectId: 'fitness-tracker-de06b',
    appId: '1:450961916900:web:a85ab7b9651ed92cd5bdf1',
    storageBucket: 'fitness-tracker-de06b.appspot.com',
    locationId: 'europe-west',
    apiKey: 'AIzaSyCae4RTHeovIDsippQzDnGFUhgExauhKv8',
    authDomain: 'fitness-tracker-de06b.firebaseapp.com',
    messagingSenderId: '450961916900',
  },
  api: {
    createUser:
      'http://localhost:5001/fitness-tracker-de06b/us-central1/createUser',
  },
  production: false,
} as const;

export type Environment = typeof environment;

// *Function-emulator
// *https://us-central1-fitness-tracker-de06b.cloudfunctions.net/createUser
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
