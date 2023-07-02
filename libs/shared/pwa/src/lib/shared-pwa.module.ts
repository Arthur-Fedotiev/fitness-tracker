import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';

import { environment } from '@fitness-tracker/shared/environments';
import { PwaSnackbarComponent } from './components/pwa-snackbar.component';
import { ServiceWorkerModule } from '@angular/service-worker';

const SW_SOURCE = 'ngsw-worker.js';
const SW_CONFIG = {
  enabled: environment.production,
  registrationStrategy: 'registerWhenStable:30000',
};

@NgModule({
  imports: [
    CommonModule,
    ServiceWorkerModule.register(SW_SOURCE, SW_CONFIG),
    PwaSnackbarComponent,
  ],
  exports: [PwaSnackbarComponent],
})
export class SharedPwaModule {}

@NgModule({})
export class SharedRootPwaModule {
  static forRoot(): ModuleWithProviders<SharedPwaModule> {
    return {
      ngModule: SharedPwaModule,
    };
  }
}
