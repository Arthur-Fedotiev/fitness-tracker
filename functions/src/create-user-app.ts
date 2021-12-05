import { auth, db } from './init';

import express from 'express'
import cors from 'cors';
import { logger } from 'firebase-functions';
import { getUserCredentialsMiddleware } from './auth.middleware';
import { CreateUserRequestBody } from './models/create-user.models';

export const createUserApp: express.Application = express();

createUserApp.use(express.json());
createUserApp.use(cors({ origin: true }));
createUserApp.use(getUserCredentialsMiddleware);

createUserApp.post('/', async (req: express.Request, res: express.Response) => {

  logger.debug(`Calling create user function.`);

  try {

    if (!(req.uid && req.admin)) {
      const message = `Denied access to user creation service.`;

      logger.debug(message);
      res.status(403).json({ message });

      return;
    }

    const { email, password, isAdmin }: CreateUserRequestBody = req.body;
    const user = await auth.createUser({
      email,
      password
    });

    await auth.setCustomUserClaims(user.uid, { admin: isAdmin });

    db.doc(`users/${user.uid}`).set({});

    res.status(200).json({ uid: user.uid, user: user, message: 'User created successfully.' });

  }
  catch (err) {
    logger.error(`Could not create user.`, err);
    res.status(500).json({ message: 'Could not create user.' });
  }
});

