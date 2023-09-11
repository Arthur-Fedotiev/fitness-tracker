import * as admin from 'firebase-admin';
import { ROLES } from 'shared-package';
import {
  catchError,
  finalize,
  first,
  from,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { failureIcon, successIcon } from './utils/constants';
import { collectedAnswers$ } from './utils/collectedAnswers';

async function updateUserRole(userUid: string, role: string) {
  await admin
    .auth()
    .setCustomUserClaims(userUid, { admin: role === ROLES.ADMIN, role });

  console.log(`\n${successIcon}  User role is now ${role}.\n`);
}

const updateUserRole$ = (userUid: string, role: string) =>
  from(updateUserRole(userUid, role));

collectedAnswers$
  .pipe(
    tap(([serviceAccountPath]) =>
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccountPath),
      }),
    ),
    switchMap(([_, userUid, role]) => updateUserRole$(userUid, role)),
    finalize(() => process.exit()),
    catchError((err) => {
      console.error(`${failureIcon} ${err?.message}`);
      return throwError(() => err);
    }),
    first(),
  )
  .subscribe();
