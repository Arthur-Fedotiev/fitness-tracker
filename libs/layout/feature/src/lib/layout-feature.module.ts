import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout/layout.component';
import { LayoutUiModule } from '@fitness-tracker/layout/ui';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [CommonModule, LayoutUiModule, RouterModule],
  declarations: [
    LayoutComponent
  ],
  exports: [
    LayoutComponent
  ],
})
export class LayoutFeatureModule { }
