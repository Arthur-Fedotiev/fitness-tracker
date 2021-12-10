import * as admin from 'firebase-admin';
import { switchMap, tap, throwError } from 'rxjs';
import { updateUserRole$ } from './lib/update-user-role';
import { collectedAnswers$ } from './lib/collectedAnswers';
import { catchError, finalize, first } from 'rxjs/operators';
import { failureIcon } from './lib/utils/constants';


collectedAnswers$.pipe(
  tap(([serviceAccountPath]) => admin.initializeApp({
    credential: admin.credential.cert(serviceAccountPath),
  })),
  switchMap(([_, userUid, role]) => updateUserRole$(userUid, role)),
  finalize(() => process.exit()),
  catchError(err => {
    console.error(`${failureIcon} ${err?.message}`);
    return throwError(() => err);
  }),
  first(),
).subscribe()
