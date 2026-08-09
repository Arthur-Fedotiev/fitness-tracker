import { provideLayout } from '@fitness-tracker/layout/feature';
import { provideSharedDataAccess } from '@fitness-tracker/shared/data-access';
import { providePwa } from '@fitness-tracker/shared/pwa';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { provideAuthDomain } from '@fitness-tracker/auth/domain';

export const ensureProvidedOnceFactory = (name = 'Dependencies') => {
  let isProvided = false;

  return () => {
    if (isProvided) {
      throw new Error(`${name} can only be provided once.`);
    }

    isProvided = true;
  };
};

const coreGuard = ensureProvidedOnceFactory('Core Dependencies');

export const provideCore = () => {
  coreGuard();

  return [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        subscriptSizing: 'dynamic',
      },
    },
    provideSharedDataAccess(),
    provideLayout(),
    provideAuthDomain(),
    providePwa(),
  ];
};
