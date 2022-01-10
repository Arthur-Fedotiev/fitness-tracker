import { db } from '../init';
import { auth as Auth } from 'firebase-admin/lib/auth';
import * as functions from 'firebase-functions';

export default async (user: Auth.UserRecord): Promise<void> => {
  try {
    await db.doc(`users/${user.uid}`).delete();

    functions.logger.log(`User with uid: ${user.uid} deleted successfully`);
  } catch (err) {
    functions.logger.error(`User deletion failed with the following: ${err}`);
  }
};
