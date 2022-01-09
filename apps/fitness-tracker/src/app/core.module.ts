import { NgModule, Optional, SkipSelf } from '@angular/core';
import { AuthFeatureModule } from '@fitness-tracker/auth/feature';
import { ExercisesFeatureModule } from '@fitness-tracker/exercises/feature';
import { LayoutFeatureModule } from '@fitness-tracker/layout/feature';
import { SharedDataAccessModule } from '@fitness-tracker/shared/data-access';
import { SharedI18nRootModule } from '@fitness-tracker/shared/i18n';
import { WorkoutFacadeProvider } from '@fitness-tracker/shared/utils';
import { WorkoutFacadeService } from '@fitness-tracker/workout/data';
import { TranslateModule } from '@ngx-translate/core';

export abstract class EnsureImportedOnceModule<T extends NgModule> {
  protected constructor(targetModule: T) {
    if (targetModule) {
      throw new Error(
        `${targetModule.constructor.name} has already been loaded.`,
      );
    }
  }
}

@NgModule({
  imports: [
    SharedI18nRootModule.forRoot(),
    SharedDataAccessModule.forRoot(),
    ExercisesFeatureModule.forRoot(),
    LayoutFeatureModule.forRoot(),
    AuthFeatureModule.forRoot(),
  ],
  providers: [
    {
      provide: WorkoutFacadeProvider,
      useExisting: WorkoutFacadeService,
    },
  ],
  exports: [TranslateModule],
})
export class CoreModule extends EnsureImportedOnceModule<CoreModule> {
  public constructor(@SkipSelf() @Optional() parent: CoreModule) {
    super(parent);
  }
}
