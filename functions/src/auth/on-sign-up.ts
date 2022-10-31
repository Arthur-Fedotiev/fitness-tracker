import { logger } from 'firebase-functions';
import { auth, db } from '../init';
import { ROLES } from 'shared-package';

export default async (user: { uid: string }): Promise<void> => {
  try {
    await auth.setCustomUserClaims(user.uid, {
      admin: false,
      role: ROLES.TRAINEE,
    });

    db.doc(`users/${user.uid}`).set({});

    logger.log(`User signed-up as TRAINEE has uid: ${user.uid}`);
  } catch (err) {
    logger.error(`User sign-up errored with the following: ${err}`);
  }
};
