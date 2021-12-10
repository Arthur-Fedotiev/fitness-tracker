import * as functions from 'firebase-functions';
import { auth as Auth } from 'firebase-admin/lib/auth';
import { auth, db } from '../init';
import { ROLES } from 'auth-package';

export default async (user: Auth.UserRecord): Promise<void> => {
  try {
    await auth.setCustomUserClaims(user.uid, {
      admin: false,
      role: ROLES.TRAINEE,
    });

    db.doc(`users/${user.uid}`).set({});

    functions.logger.log(`User signed-up as TRAINEE has uid: ${user.uid}`);
  } catch (err) {
    functions.logger.error(`User sign-up errored with the following: ${err}`);
  }
};
