import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { AuthEffects } from './application/+state/effects/auth.effects';
import { importProvidersFrom } from '@angular/core';
import {
  authFeatureKey,
  reducer,
} from './application/+state/reducers/auth.reducer';
import { USER_DATA_QUERY_TOKEN } from '@fitness-tracker/shared/models';
import { AuthFacadeService } from './services/auth-facade.service';

export const authDomainProviders = [
  importProvidersFrom(
    StoreModule.forFeature(authFeatureKey, reducer),
    EffectsModule.forFeature([AuthEffects]),
  ),
  {
    provide: USER_DATA_QUERY_TOKEN,
    useExisting: AuthFacadeService,
  },
];
