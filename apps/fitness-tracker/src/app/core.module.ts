import { NgModule } from '@angular/core';
import { SharedDataAccessModule } from '@fitness-tracker/shared/data-access';

@NgModule({
  declarations: [],
  imports: [SharedDataAccessModule.forRoot()],
})
export class CoreModule {}
