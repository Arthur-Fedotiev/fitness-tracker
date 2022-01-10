import { firestore, auth as adminAuth, initializeApp } from 'firebase-admin/lib/';

initializeApp();

export const db = firestore();
export const auth = adminAuth();
