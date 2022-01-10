import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthFeatureRoutingModule } from './auth-feature.routing.module';
import { AuthDataModule } from '@fitness-tracker/auth/data';
import { ICON_PROVIDER } from '@fitness-tracker/shared-ui-material';
@NgModule({
  imports: [CommonModule, AuthFeatureRoutingModule, AuthDataModule],
})
export class AuthFeatureModule {
  static forRoot(): ModuleWithProviders<AuthFeatureModule> {
    return {
      ngModule: AuthFeatureModule,
      providers: [
        {
          provide: ICON_PROVIDER,
          useValue: { iconKeys: ['sign-up'], iconUrl: '/assets/images' },
          multi: true,
        },
      ],
    };
  }
}
