import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@fitness-tracker/shared-ui-material';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RolesModule } from '@fitness-tracker/auth/feature';
import { LayoutUiComponent } from './layout-ui.component';
import { SettingsBar } from '../settings/settings-bar.module';
import { NavigationBarModule } from '../navigation-bar/navigation-bar.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FlexLayoutModule,
    SettingsBar,
    NavigationBarModule,
  ],
  declarations: [LayoutUiComponent],
  exports: [LayoutUiComponent],
})
export class LayoutUiModule {}
