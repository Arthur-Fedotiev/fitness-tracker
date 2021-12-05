import { logger } from 'firebase-functions';
import { auth } from "./init";
import { auth as Auth } from 'firebase-admin/lib/auth';

export function getUserCredentialsMiddleware(req: Express.Request, res: Express.Response, next: any) {

  logger.debug(`Attempting to extract user credentials from request.`);

  const jwt: string = (req as any).headers.authorization;

  if (jwt) {
    auth.verifyIdToken(jwt)
      .then((jwtPayload: Auth.DecodedIdToken) => {

        req.uid = jwtPayload.uid;
        req.admin = jwtPayload.admin;

        logger.debug(
          `Credentials: uid=${jwtPayload.uid}, admin=${jwtPayload.admin}`);

        next();
      })
      .catch((err: unknown) => {
        console.log("Error ocurred while validating JWT", err);
        next();
      });
  }
  else {
    next();
  }
}
