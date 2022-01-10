import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginRoutingModule } from './login-routing.module';
import { AuthComponent } from './auth.component';
import { MaterialModule } from '@fitness-tracker/shared-ui-material';
import { FirebaseUIModule } from 'firebaseui-angular';


@NgModule({
  declarations: [AuthComponent],
  imports: [
    CommonModule,
    LoginRoutingModule,
    FirebaseUIModule,
    MaterialModule
  ]
})
export class LoginModule { }
