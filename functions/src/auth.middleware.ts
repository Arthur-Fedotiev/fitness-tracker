import * as functions from 'firebase-functions';
import { auth } from "./init";



export function getUserCredentialsMiddleware(req: any, res: any, next: any) {

  functions.logger.debug(`Attempting to extract user credentials from request.`);

  const jwt = req.headers.authorization;

  if (jwt) {
    auth.verifyIdToken(jwt)
      .then((jwtPayload: any) => {

        req["uid"] = jwtPayload.uid;
        req["admin"] = jwtPayload.admin;

        functions.logger.debug(
          `Credentials: uid=${jwtPayload.uid}, admin=${jwtPayload.admin}`);

        next();
      })
      .catch((err: any) => {
        console.log("Error ocurred while validating JWT", err);
        next();
      });
  }
  else {
    next();
  }
}
