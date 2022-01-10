import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromUsers from '../reducers/users.reducer';

export const selectUsersState = createFeatureSelector<fromUsers.State>(
  fromUsers.usersFeatureKey
);
