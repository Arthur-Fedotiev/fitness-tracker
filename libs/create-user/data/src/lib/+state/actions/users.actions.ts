import { User } from '@fitness-tracker/create-user/models';
import { createAction, props } from '@ngrx/store';
import { USERS_ACTION_NAMES } from '../models/action-names.enums';
import { WithPayload } from '@fitness-tracker/shared/utils';

export const createUser = createAction(
  USERS_ACTION_NAMES.CREATE_USER,
  props<WithPayload<User>>()
);
export const createUserSuccess = createAction(
  USERS_ACTION_NAMES.CREATE_USER_SUCCESS,
  props<WithPayload<number>>()
);
export const createUserFailure = createAction(
  USERS_ACTION_NAMES.CREATE_USER_FAILURE
);
