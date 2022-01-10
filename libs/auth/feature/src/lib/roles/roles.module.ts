import { NgModule } from '@angular/core';
import { RolesDirective } from './roles.directive';

@NgModule({
  declarations: [
    RolesDirective
  ],
  exports: [
    RolesDirective
  ],
})
export class RolesModule { }
