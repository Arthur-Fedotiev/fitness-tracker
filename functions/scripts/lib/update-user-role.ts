import * as admin from 'firebase-admin';
import { ROLES } from "auth-package";
import { from } from 'rxjs';
import { successIcon } from './utils/constants';

async function updateUserRole(userUid: string, role: string) {
  await admin
    .auth()
    .setCustomUserClaims(userUid, { admin: role === ROLES.ADMIN, role });

  console.log(`\n${successIcon}  User role is now ${role}.\n`);
}

export const updateUserRole$ = (userUid: string, role: string) => from(updateUserRole(userUid, role))
