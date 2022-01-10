import { createReducer } from '@ngrx/store';
import { User } from '@fitness-tracker/create-user/models';

export const usersFeatureKey = 'users';

export interface State {
  users: ReadonlyArray<User>
}

export const initialState: State = {
  users: [],
};

export const reducer = createReducer(
  initialState,
);
