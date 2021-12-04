import { auth, db } from "./init";

const express = require('express');
import * as functions from 'firebase-functions';
import { getUserCredentialsMiddleware } from "./auth.middleware";

const bodyParser = require('body-parser');
const cors = require('cors');

export const createUserApp = express();

createUserApp.use(bodyParser.json());
createUserApp.use(cors({ origin: true }));
createUserApp.use(getUserCredentialsMiddleware);


createUserApp.post("/", async (req: any, res: any) => {

  functions.logger.debug(`Calling create user function.`);

  try {

    if (!(req["uid"] && req["admin"])) {
      const message = `Denied access to user creation service.`;

      functions.logger.debug(message);
      res.status(403).json({ message });

      return;
    }

    const { email, password, admin } = req.body;

    const user = await auth.createUser({
      email,
      password
    });

    await auth.setCustomUserClaims(user.uid, { admin });

    db.doc(`users/${user.uid}`).set({});


    res.status(200).json({ uid: user.uid, message: "User created successfully." });

  }
  catch (err) {
    functions.logger.error(`Could not create user.`, err);
    res.status(500).json({ message: "Could not create user." });
  }

});

