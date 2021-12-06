import { logger } from 'firebase-functions';
import { auth } from './init';
import { auth as Auth } from 'firebase-admin/lib/auth';
import { CREATE_USER_MIDDLEWARE_MESSAGES } from './utils/models/constants/messages.consts';

export function getUserCredentialsMiddleware(req: Express.Request, _res: Express.Response, next: any) {
  logger.debug(CREATE_USER_MIDDLEWARE_MESSAGES.ATTEMPT_EXTRACT_CREDS);

  const jwt: string = (req as any).headers.authorization;

  if (jwt) {
    auth.verifyIdToken(jwt)
        .then(({ uid, admin }: Auth.DecodedIdToken) => {
          req.uid = uid;
          req.admin = admin;

          logger.debug(
              `Credentials: uid=${uid}, admin=${admin}`);

          next();
        })
        .catch((err: unknown) => {
          console.log(CREATE_USER_MIDDLEWARE_MESSAGES.JWT_VALIDATION_ERR, err);
          next();
        });
  } else {
    next();
  }
}
