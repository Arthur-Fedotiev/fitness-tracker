import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateUserDisplayComponent } from './create-user-display/create-user-display.component';

import { AuthFeatureRoutingModule } from './create-user-routing.module';
import { CreateUserDataModule } from '@fitness-tracker/create-user/data';

@NgModule({
    imports: [
    CommonModule,
    AuthFeatureRoutingModule,
    CreateUserDataModule,
    CreateUserDisplayComponent,
],
})
export class CreateUserFeatureModule { }
