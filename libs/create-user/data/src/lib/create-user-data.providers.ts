import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { UsersEffects } from './+state/effects/users.effects';
import * as fromUsers from './+state/reducers/users.reducer';

export const createUserDataProviders = [
  provideState(fromUsers.usersFeatureKey, fromUsers.reducer),
  provideEffects([UsersEffects]),
];
