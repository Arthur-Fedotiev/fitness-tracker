import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthFeatureRoutingModule } from './auth-feature.routing.module';
import { AuthDataModule } from '@fitness-tracker/auth/data';
@NgModule({
  imports: [CommonModule, AuthFeatureRoutingModule, AuthDataModule],
})


export class AuthFeatureModule {
}
