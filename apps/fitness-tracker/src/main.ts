import { enableProdMode, importProvidersFrom } from '@angular/core';
import { environment } from '@fitness-tracker/shared/environments';

import { AppComponent } from './app/app.component';
import { provideCore } from './app/core.providers';
import { MatDialogModule } from '@angular/material/dialog';
import { APP_ROUTES } from './app/app.routes';
import { FlexLayoutModule } from '@angular/flex-layout';
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
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';

if (environment.production) {
  enableProdMode();
}

setTimeout(function scheduleAppBootstrap() {
  bootstrapApplication(AppComponent, {
    providers: [
      importProvidersFrom(BrowserModule, FlexLayoutModule, MatDialogModule),
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
