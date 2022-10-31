import { logger } from 'firebase-functions';
import { db } from '../init';

export default async (user: any): Promise<void> => {
  try {
    await db.doc(`users/${user.uid}`).delete();

    logger.log(`User with uid: ${user.uid} deleted successfully`);
  } catch (err) {
    logger.error(`User deletion failed with the following: ${err}`);
  }
};
