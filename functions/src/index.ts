import * as functions from 'firebase-functions';
import { createUserApp } from './create-user-app';

export const createUser: functions.HttpsFunction =
  functions.https.onRequest(createUserApp);

export const onSignUpCreateUserDocAndSetCredentials = functions.auth
    .user()
    .onCreate(async (user: any) => {
      await (await import('./auth/on-sign-up')).default(user);
    });

export const onDeleteRemoveUserDoc = functions.auth
    .user()
    .onDelete(async (user: any) => {
      await (await import('./auth/on-delete')).default(user);
    });
