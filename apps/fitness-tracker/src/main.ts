import { provideZoneChangeDetection } from '@angular/core';

import { AppComponent } from './app/app.component';
import { provideCore } from './app/core.providers';
import { APP_ROUTES } from './app/app.routes';
import {
  withInterceptorsFromDi,
  provideHttpClient,
} from '@angular/common/http';
import {
  provideRouter,
  withComponentInputBinding,
  withEnabledBlockingInitialNavigation,
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
      ),
      provideCore(),
      provideAnimations(),
      provideHttpClient(withInterceptorsFromDi()),
    ],
  }).catch((err) => console.error(err));
});
