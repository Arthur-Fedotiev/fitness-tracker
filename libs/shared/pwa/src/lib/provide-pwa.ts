import { importProvidersFrom } from '@angular/core';

import { environment } from '@fitness-tracker/shared/environments';
import { ServiceWorkerModule } from '@angular/service-worker';
import { MatSnackBarModule } from '@angular/material/snack-bar';

const SW_SOURCE = 'ngsw-worker.js';
const SW_CONFIG = {
  enabled: environment.production,
  // Firestore holds a long-lived WebChannel open, so the app never reports
  // stable and `registerWhenStable` always degraded to its full timeout.
  registrationStrategy: 'registerImmediately',
};

export const providePwa = () => [
  importProvidersFrom(
    MatSnackBarModule,
    ServiceWorkerModule.register(SW_SOURCE, SW_CONFIG),
  ),
];
