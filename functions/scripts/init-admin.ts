import * as admin from 'firebase-admin';
import { tap, switchMap, from } from 'rxjs';
import { answers$, collectAnswers } from './questions.js';
import { questions, ROLES } from './utils/constants.js';

collectAnswers(questions);

async function initAdmin(adminUid: string, role: string) {
  await admin
    .auth()
    .setCustomUserClaims(adminUid, { admin: role === ROLES.ADMIN, role });

  console.log(`User role is now ${role}.`);
}

answers$.pipe(
  tap(([serviceAccountPath]) => admin.initializeApp({
    credential: admin.credential.cert(serviceAccountPath),
  })),
  switchMap(([_, userUid, role]) => from(initAdmin(userUid, role))),
  tap(_ => process.exit())
).subscribe()
