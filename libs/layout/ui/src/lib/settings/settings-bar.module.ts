import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsBarComponent } from './settings-bar.component';
import { MaterialModule } from '@fitness-tracker/shared-ui-material';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  declarations: [SettingsBarComponent],
  imports: [CommonModule, MaterialModule, FlexLayoutModule],
  exports: [SettingsBarComponent],
})
export class SettingsBar {}
