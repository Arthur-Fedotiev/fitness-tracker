// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { LANG_CODES } from 'shared-package';

export const environment = {
  useEmulators: false,
  locales: [...LANG_CODES],
  defaultLocale: 'en',
  firebase: {
    apiKey: 'AIzaSyBj0rywwJsn97DKuR5cYPX-edmGKISvpYM',
    authDomain: 'fitness-tracker-ui-dev.firebaseapp.com',
    projectId: 'fitness-tracker-ui-dev',
    storageBucket: 'fitness-tracker-ui-dev.appspot.com',
    messagingSenderId: '28325280548',
    appId: '1:28325280548:web:bcc5caa8fa5766c27fd1b1',
  },
  api: {
    createUser:
      'https://us-central1-fitness-tracker-ui-dev.cloudfunctions.net/createUser',
  },
  production: true,
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
