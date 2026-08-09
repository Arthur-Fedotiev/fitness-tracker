import { HttpsFunction, https, auth } from 'firebase-functions';
import { createUserApp } from './create-user-app';

export const createUser: HttpsFunction =
  https.onRequest(createUserApp);

export const onSignUpCreateUserDocAndSetCredentials = auth
    .user()
    .onCreate(async (user: any) => {
      await (await import('./auth/on-sign-up')).default(user);
    });

export const onDeleteRemoveUserDoc = auth
    .user()
    .onDelete(async (user: any) => {
      await (await import('./auth/on-delete')).default(user);
    });
