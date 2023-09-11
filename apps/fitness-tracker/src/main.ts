import { enableProdMode, importProvidersFrom } from '@angular/core';
import { environment } from '@fitness-tracker/shared/environments';

import { AppComponent } from './app/app.component';
import { provideCoreDependencies } from './app/core.module';
import { MatDialogModule } from '@angular/material/dialog';
import { LayoutFeatureModule } from '@fitness-tracker/layout/feature';
// import { AuthModule } from '@angular/fire/auth';
import { AppRoutingModule } from './app/app-routing.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
  withInterceptorsFromDi,
  provideHttpClient,
} from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';

if (environment.production) {
  enableProdMode();
}

setTimeout(function scheduleAppBootstrap() {
  bootstrapApplication(AppComponent, {
    providers: [
      importProvidersFrom(
        BrowserModule,
        RouterModule,
        FlexLayoutModule,
        AppRoutingModule,
        // AuthModule,
        LayoutFeatureModule,
        MatDialogModule,
      ),
      provideCoreDependencies(),
      provideAnimations(),
      provideHttpClient(withInterceptorsFromDi()),
    ],
  }).catch((err) => console.error(err));
});
