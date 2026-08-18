/**
 * Firebase surfaces auth failures as a `FirebaseError` carrying a `auth/*` code.
 * The raw `message` is developer-facing ("Firebase: Password should be at least
 * 6 characters (auth/weak-password)."), so map the codes we can act on to text a
 * lifter can actually read, and fall back to a generic line for the rest.
 */
const AUTH_ERROR_MESSAGES: Record<string, string> = {
  'auth/weak-password': 'Password should be at least 6 characters.',
  'auth/email-already-in-use':
    'That email is already registered. Try logging in instead.',
  'auth/invalid-email': 'That email address is not valid.',
  'auth/missing-email': 'Enter an email address.',
  'auth/missing-password': 'Enter a password.',
  'auth/invalid-credential': 'Incorrect email or password.',
  'auth/user-not-found': 'Incorrect email or password.',
  'auth/wrong-password': 'Incorrect email or password.',
  'auth/user-disabled': 'This account has been disabled.',
  'auth/too-many-requests':
    'Too many attempts. Wait a moment and try again.',
  'auth/network-request-failed':
    'Network error. Check your connection and try again.',
  'auth/operation-not-allowed':
    'This sign-in method is not enabled for this app.',
  'auth/popup-blocked':
    'Your browser blocked the sign-in popup. Allow popups and try again.',
  'auth/unauthorized-domain':
    'This domain is not authorised for sign-in. Contact support.',
};

/** Codes that mean "the user backed out", not "something went wrong". */
const CANCELLED_CODES = new Set([
  'auth/popup-closed-by-user',
  'auth/cancelled-popup-request',
  'auth/user-cancelled',
]);

const GENERIC_MESSAGE = 'Something went wrong. Please try again.';

const isCodedError = (error: unknown): error is { code: string } =>
  typeof error === 'object' &&
  error !== null &&
  typeof (error as { code?: unknown }).code === 'string';

/**
 * Turns a thrown auth error into a message for the user, or `null` when the
 * failure was the user cancelling — there is nothing to report in that case.
 */
export const toAuthErrorMessage = (error: unknown): string | null => {
  if (!isCodedError(error)) {
    return GENERIC_MESSAGE;
  }

  if (CANCELLED_CODES.has(error.code)) {
    return null;
  }

  return AUTH_ERROR_MESSAGES[error.code] ?? GENERIC_MESSAGE;
};
