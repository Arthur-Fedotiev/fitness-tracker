import { NgModule } from '@angular/core';
import { ExercisesPageComponent } from './exercises-page/exercises-page.component';
import { ExercisesFeatureRoutingModule } from './exercises-feature-routing.module';
import { ExercisesDataModule } from '@fitness-tracker/exercises/data';

@NgModule({
  imports: [
    ExercisesFeatureRoutingModule,
    ExercisesDataModule,
  ],
  declarations: [
    ExercisesPageComponent,
  ],
  exports: [ExercisesPageComponent],
})
export class ExercisesFeatureModule { }
