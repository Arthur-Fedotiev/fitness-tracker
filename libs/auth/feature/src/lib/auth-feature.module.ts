import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthFeatureRoutingModule } from './auth-feature.routing.module';
import { AuthComponent } from './login/auth.component';
import { AuthUiModule } from '@fitness-tracker/auth/ui';

@NgModule({
  declarations: [AuthComponent],
  imports: [CommonModule, AuthFeatureRoutingModule, AuthUiModule],
  exports: [AuthComponent]
})
export class AuthFeatureModule { }
