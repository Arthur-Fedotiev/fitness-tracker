import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginRoutingModule } from './login-routing.module';
import { AuthComponent } from './auth.component';

import { FirebaseUIModule } from 'firebaseui-angular';


@NgModule({
    imports: [
    CommonModule,
    LoginRoutingModule,
    FirebaseUIModule,
    AuthComponent
]
})
export class LoginModule { }
