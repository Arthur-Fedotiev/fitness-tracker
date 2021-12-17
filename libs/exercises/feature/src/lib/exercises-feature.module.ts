import { ModuleWithProviders, NgModule } from '@angular/core';
import { ExercisesPageComponent } from './exercises-page/exercises-page.component';
import { ExercisesFeatureRoutingModule } from './exercises-feature-routing.module';
import { ExercisesDataModule } from '@fitness-tracker/exercises/data';
import { ICON_PROVIDER } from '@fitness-tracker/shared-ui-material';

@NgModule({
  imports: [ExercisesFeatureRoutingModule, ExercisesDataModule],
  declarations: [ExercisesPageComponent],
  exports: [ExercisesPageComponent],
})
export class ExercisesFeatureModule {
  static forRoot(): ModuleWithProviders<ExercisesFeatureModule> {
    return {
      ngModule: ExercisesFeatureModule,
      providers: [
        {
          provide: ICON_PROVIDER,
          useValue: {
            iconKeys: ['exercise-rating'],
            iconUrl: '/assets/images',
          },
          multi: true,
        },
      ],
    };
  }
}
