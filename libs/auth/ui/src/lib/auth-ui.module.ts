import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@fitness-tracker/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { LoginFormComponent } from './login-form/login-form.component';

@NgModule({
  declarations: [LoginFormComponent],
  imports: [CommonModule, MaterialModule, FlexLayoutModule],
  exports: [LoginFormComponent]
})


export class AuthUiModule { }
