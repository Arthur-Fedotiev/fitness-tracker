import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { AuthModule } from '@angular/fire/auth';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { AuthFeatureModule } from '@fitness-tracker/auth/feature';

import { HttpClientModule } from '@angular/common/http';
import { LayoutFeatureModule } from '@fitness-tracker/layout/feature';
import { CoreModule } from './core.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '@fitness-tracker/shared/environments';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule,
    HttpClientModule,
    FlexLayoutModule,
    AppRoutingModule,
    AuthModule,
    AuthFeatureModule,
    LayoutFeatureModule,
    MatDialogModule,
    CoreModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
