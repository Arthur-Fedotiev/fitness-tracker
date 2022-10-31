import { HttpsFunction, https, auth, firestore, Change, EventContext } from 'firebase-functions';
import { createUserApp } from './create-user-app';
import { COLLECTIONS } from 'shared-package';

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

export const onExerciseTranslatableDataUpdate = firestore
    .document(`${COLLECTIONS.EXERCISES}/{exerciseId}`)
    .onUpdate(
        async (
            change: Change<firestore.QueryDocumentSnapshot>,
            context: EventContext,
        ) => {
          await (
            await import('./exercises-translation/on-update-translated-data')
          ).default(change, context);
        },
    );

export const onExerciseDeleteTranslationsDelete = firestore
    .document(`${COLLECTIONS.EXERCISES}/{exerciseId}`)
    .onDelete(
        async (
            _: firestore.QueryDocumentSnapshot,
            context: EventContext,
        ) => {
          await (
            await import(
                './exercises-translation/on-exercise-delete-remove-translations'
            )
          ).default(context);
        },
    );
