import { provideZoneChangeDetection } from '@angular/core';

import { AppComponent } from './app/app.component';
import { provideCore } from './app/core.providers';
import { APP_ROUTES } from './app/app.routes';
import {
  withInterceptorsFromDi,
  provideHttpClient,
} from '@angular/common/http';
import {
  PreloadAllModules,
  provideRouter,
  withComponentInputBinding,
  withEnabledBlockingInitialNavigation,
  withPreloading,
} from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { bootstrapApplication } from '@angular/platform-browser';

setTimeout(function scheduleAppBootstrap() {
  bootstrapApplication(AppComponent, {
    providers: [
      provideZoneChangeDetection(),
      provideRouter(
        APP_ROUTES,
        withEnabledBlockingInitialNavigation(),
        withComponentInputBinding(),
        // Route chunks are fetched in the background after the initial render,
        // so navigating from the nav bar hits warm cache instead of the network.
        withPreloading(PreloadAllModules),
      ),
      provideCore(),
      provideAnimations(),
      provideHttpClient(withInterceptorsFromDi()),
    ],
  }).catch((err) => console.error(err));
});
