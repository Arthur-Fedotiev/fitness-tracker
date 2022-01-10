import { logger } from 'firebase-functions';
import { auth } from './init';
import { auth as Auth } from 'firebase-admin/lib/auth';
import { CREATE_USER_MIDDLEWARE_MESSAGES } from './utils/models/constants/messages.consts';
import { WithHEaders } from './utils/models/create-user.models';

export function getUserCredentialsMiddleware(
    req: Express.Request,
    _res: Express.Response,
    next: () => void,
): void {
  logger.debug(CREATE_USER_MIDDLEWARE_MESSAGES.ATTEMPT_EXTRACT_CREDS);

  const jwt: string = (req as WithHEaders).headers.authorization;

  if (jwt) {
    auth
        .verifyIdToken(jwt)
        .then(({ uid, admin, role }: Auth.DecodedIdToken) => {
          req.uid = uid;
          req.admin = admin;
          req.role = role;

          logger.debug(`Credentials: uid=${uid}, role=${admin}`);

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
