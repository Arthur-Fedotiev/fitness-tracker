import { importProvidersFrom } from '@angular/core';

import { environment } from '@fitness-tracker/shared/environments';
import { ServiceWorkerModule } from '@angular/service-worker';
import { MatSnackBarModule } from '@angular/material/snack-bar';

const SW_SOURCE = 'ngsw-worker.js';
const SW_CONFIG = {
  enabled: environment.production,
  registrationStrategy: 'registerWhenStable:30000',
};

export const providePwa = () => [
  importProvidersFrom(
    MatSnackBarModule,
    ServiceWorkerModule.register(SW_SOURCE, SW_CONFIG),
  ),
];
