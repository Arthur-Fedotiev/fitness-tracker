import { toAuthErrorMessage } from './auth-error-message';

describe('toAuthErrorMessage', () => {
  it('maps a known Firebase auth code to readable text', () => {
    expect(toAuthErrorMessage({ code: 'auth/weak-password' })).toBe(
      'Password should be at least 6 characters.',
    );
  });

  it('gives the same message for every "bad credentials" variant, so the response does not leak whether an account exists', () => {
    const messages = [
      'auth/invalid-credential',
      'auth/user-not-found',
      'auth/wrong-password',
    ].map((code) => toAuthErrorMessage({ code }));

    expect(new Set(messages).size).toBe(1);
    expect(messages[0]).toBe('Incorrect email or password.');
  });

  it('reports nothing when the user cancelled the sign-in popup', () => {
    expect(toAuthErrorMessage({ code: 'auth/popup-closed-by-user' })).toBeNull();
    expect(
      toAuthErrorMessage({ code: 'auth/cancelled-popup-request' }),
    ).toBeNull();
  });

  it('falls back to a generic message for an unmapped code', () => {
    expect(toAuthErrorMessage({ code: 'auth/internal-error' })).toBe(
      'Something went wrong. Please try again.',
    );
  });

  it('falls back to a generic message for a non-Firebase throwable', () => {
    expect(toAuthErrorMessage(new Error('boom'))).toBe(
      'Something went wrong. Please try again.',
    );
    expect(toAuthErrorMessage(undefined)).toBe(
      'Something went wrong. Please try again.',
    );
  });
});
