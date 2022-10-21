import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsBarComponent } from './settings-bar.component';
import { MaterialModule } from '@fitness-tracker/shared-ui-material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import { E2eDirectiveModule } from '@fitness-tracker/shared/utils';

@NgModule({
  declarations: [SettingsBarComponent],
  imports: [
    CommonModule,
    MaterialModule,
    FlexLayoutModule,
    TranslateModule,
    E2eDirectiveModule,
  ],
  exports: [SettingsBarComponent],
})
export class SettingsBar {}
