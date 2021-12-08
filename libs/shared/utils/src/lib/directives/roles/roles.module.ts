import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RolesDirective } from './roles.directive';



@NgModule({
  declarations: [
    RolesDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    RolesDirective
  ]
})
export class RolesModule { }
