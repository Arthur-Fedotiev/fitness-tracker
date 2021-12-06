import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateUserDisplayComponent } from './create-user-display/create-user-display.component';
import { CreateUserUiModule } from '@fitness-tracker/create-user/ui';
import { AuthFeatureRoutingModule } from './create-user-routing.module';
import { CreateUserDataModule } from '@fitness-tracker/create-user/data';

@NgModule({
  imports: [
    CommonModule,
    CreateUserUiModule,
    AuthFeatureRoutingModule,
    CreateUserUiModule,
    CreateUserDataModule],
  declarations: [
    CreateUserDisplayComponent
  ],
})
export class CreateUserFeatureModule { }
