import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutUiComponent } from './layout-ui/layout-ui.component';
import { MaterialModule } from "@fitness-tracker/material";
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [CommonModule, MaterialModule, RouterModule],
  declarations: [
    LayoutUiComponent
  ],
  exports: [
    LayoutUiComponent
  ],
})
export class LayoutUiModule { }
