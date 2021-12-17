import { NgModule, Optional, SkipSelf } from '@angular/core';
import { ExercisesFeatureModule } from '@fitness-tracker/exercises/feature';
import { LayoutFeatureModule } from '@fitness-tracker/layout/feature';
import { SharedDataAccessModule } from '@fitness-tracker/shared/data-access';

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
    SharedDataAccessModule.forRoot(),
    ExercisesFeatureModule.forRoot(),
    LayoutFeatureModule.forRoot(),
  ],
})
export class CoreModule extends EnsureImportedOnceModule<CoreModule> {
  public constructor(@SkipSelf() @Optional() parent: CoreModule) {
    super(parent);
  }
}
