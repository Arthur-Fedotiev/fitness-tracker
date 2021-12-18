import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout/layout.component';
import { LayoutUiModule } from '@fitness-tracker/layout/ui';
import { RouterModule } from '@angular/router';
import { ICON_PROVIDER } from '@fitness-tracker/shared-ui-material';
import { LANG_CODES } from 'shared-package';

@NgModule({
  imports: [CommonModule, LayoutUiModule, RouterModule],
  declarations: [LayoutComponent],
  exports: [LayoutComponent],
})
export class LayoutFeatureModule {
  static forRoot(): ModuleWithProviders<LayoutFeatureModule> {
    return {
      ngModule: LayoutFeatureModule,
      providers: [
        {
          provide: ICON_PROVIDER,
          useValue: { iconKeys: LANG_CODES, iconUrl: '/assets/images/flags' },
          multi: true,
        },
        {
          provide: ICON_PROVIDER,
          useValue: {
            iconKeys: ['exercises', 'add-user', 'blacksmith', 'stud'],
            iconUrl: '/assets/images/navigation',
          },
          multi: true,
        },
        {
          provide: ICON_PROVIDER,
          useValue: {
            iconKeys: ['exit'],
            iconUrl: '/assets/images/settings',
          },
          multi: true,
        },
      ],
    };
  }
}
