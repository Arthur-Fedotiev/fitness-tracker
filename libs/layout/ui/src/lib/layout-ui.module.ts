import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutUiComponent } from './layout-ui/layout-ui.component';
import { MaterialModule } from '@fitness-tracker/shared-ui-material';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RolesModule } from '@fitness-tracker/auth/feature';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    FlexLayoutModule,
    RolesModule,
  ],
  declarations: [LayoutUiComponent],
  exports: [LayoutUiComponent],
})
export class LayoutUiModule {}
