import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationBarComponent } from './navigation-bar.component';
import { MaterialModule } from '@fitness-tracker/shared-ui-material';
import { RouterModule } from '@angular/router';
import { RolesModule } from '@fitness-tracker/auth/feature';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  declarations: [NavigationBarComponent],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    RolesModule,
    FlexLayoutModule,
  ],
  exports: [NavigationBarComponent],
})
export class NavigationBarModule {}
