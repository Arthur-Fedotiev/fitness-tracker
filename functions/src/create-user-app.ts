import { auth, db } from './init';
import { ROLES } from 'shared-package';

import express from 'express';
import cors from 'cors';
import { logger } from 'firebase-functions';
import { getUserCredentialsMiddleware } from './auth.middleware';
import { CreateUserRequestBody } from './utils/models/create-user.models';
import { CREATE_USER_APP_MESSAGES } from './utils/models/constants/messages.consts';

export const createUserApp: express.Application = express();

createUserApp.use(express.json());
createUserApp.use(cors({ origin: true }));
createUserApp.use(getUserCredentialsMiddleware);

createUserApp.post('/', async (req: express.Request, res: express.Response) => {
  logger.debug(CREATE_USER_APP_MESSAGES.POST_RECEIVED);

  try {
    if (!(req.uid && req.admin && req.role === ROLES.ADMIN)) {
      const message = CREATE_USER_APP_MESSAGES.ACCESS_DENIED;

      logger.debug(message);
      res.status(403).json({ message });

      return;
    }

    const { email, password, admin, role }: CreateUserRequestBody = req.body;
    const user = await auth.createUser({
      email,
      password,
    });

    await auth.setCustomUserClaims(user.uid, { admin, role });

    db.doc(`users/${user.uid}`).set({});

    res.status(200).json({
      uid: user.uid,
      user: user,
      message: CREATE_USER_APP_MESSAGES.CREATE_SUCCESS,
    });
  } catch (err) {
    const message = CREATE_USER_APP_MESSAGES.CREATE_FAILURE;

    logger.error(message, err);
    res.status(500).json({ message });
  }
});
