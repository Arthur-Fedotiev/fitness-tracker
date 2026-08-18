import * as AuthActions from '../actions/auth.actions';
import { initialState, reducer } from './auth.reducer';
import { UserInfo } from '../../models';

const erroredState = reducer(
  initialState,
  AuthActions.loginWithEmailFailure({ payload: 'Incorrect email or password.' }),
);

describe('auth reducer error handling', () => {
  it('stores the message from a failed sign-in', () => {
    expect(erroredState.error).toBe('Incorrect email or password.');
  });

  it('clears the message when a new attempt starts', () => {
    const state = reducer(
      erroredState,
      AuthActions.loginWithEmail({ payload: { email: 'a@b.c', password: 'x' } }),
    );

    expect(state.error).toBeNull();
  });

  it('clears the message once sign-in succeeds', () => {
    const state = reducer(
      erroredState,
      AuthActions.loginSuccess({ payload: { uid: '1' } as UserInfo }),
    );

    expect(state.error).toBeNull();
  });

  it('clears the message on an explicit dismiss', () => {
    expect(reducer(erroredState, AuthActions.clearAuthError()).error).toBeNull();
  });
});
