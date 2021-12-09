import admin from 'firebase-admin';
import { ROLES } from './roles.consts.mjs';

const serviceAccountPath = process.argv[2];
const userUid = process.argv[3];
const role = process.argv[4];

if (!ROLES[role]) {
  console.error('ROLE argument must be provided as last argument');

  process.exit(9);
}

console.log(`Using service account ${serviceAccountPath}.`);
console.log(`Setting user's role ${userUid} as ${role}.`);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccountPath),
});

async function initAdmin(adminUid) {
  await admin
    .auth()
    .setCustomUserClaims(adminUid, { admin: role === 'ADMIN', role });

  console.log(`User role is now ${role}.`);
}

initAdmin(userUid).then(() => {
  console.log('Exiting.');
  process.exit();
});
