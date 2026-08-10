"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const admin = __importStar(require("firebase-admin"));
const shared_package_1 = require("shared-package");
const certPath = process.argv[2] ?? './sa.json';
admin.initializeApp({
    credential: admin.credential.cert(certPath),
});
const db = admin.firestore();
const BASE_DATA_FIELDS = [
    'name',
    'exerciseType',
    'targetMuscle',
    'equipment',
    'instructions',
    'userId',
    'admin',
];
/**
 * One-time migration for ADR-0005 (flatten-exercise-basedata): rewrites every
 * `exercises/{id}` document from `{ baseData: {...7 fields}, ...deadFields }`
 * to the 7 fields sitting flat at the document root.
 *
 * Each write is a full `.set(ref, flatData)` replace, not `.update()` or a
 * merge — that's deliberate. It's what drops the dead `translatableData`/
 * `translatedData` siblings and the `avatarUrl`/`coverUrl`/`instructionVideo`/
 * `rating`/duplicate-`id` cruft still sitting inside `baseData` on every
 * document (confirmed by survey-exercise-flatten-readiness.ts), without a
 * separate cleanup pass.
 *
 * Idempotent: a document with no `baseData` (already flat) is left alone.
 * Uses `firebase-admin`, which bypasses Firestore rules — see ADR-0005 for
 * why that lets this run before `firestore.rules`/app code change.
 *
 * Usage: `node dist/lib/flatten-exercise-basedata.js <path-to-service-account-json>`
 * Run against `./sa.json` (staging) first, confirm, then `./sa.prod.json`.
 */
async function flattenExerciseBaseData() {
    const exercisesSnapshot = await db.collection(shared_package_1.COLLECTIONS.EXERCISES).get();
    let alreadyFlat = 0;
    let flattened = 0;
    let skippedNoBaseData = 0;
    let batch = db.batch();
    let batchSize = 0;
    const flush = async () => {
        if (batchSize === 0)
            return;
        await batch.commit();
        batch = db.batch();
        batchSize = 0;
    };
    for (const doc of exercisesSnapshot.docs) {
        const data = doc.data();
        if (data.baseData == null) {
            if (BASE_DATA_FIELDS.every((field) => field in data)) {
                alreadyFlat++;
            }
            else {
                skippedNoBaseData++;
                console.warn(`${doc.id} — no baseData and not already flat, skipping`);
            }
            continue;
        }
        const flatData = Object.fromEntries(BASE_DATA_FIELDS.map((field) => [field, data.baseData[field] ?? null]));
        batch.set(doc.ref, flatData);
        batchSize++;
        flattened++;
        if (batchSize === 500) {
            await flush();
        }
    }
    await flush();
    console.log(JSON.stringify({
        total: exercisesSnapshot.size,
        flattened,
        alreadyFlat,
        skippedNoBaseData,
    }, null, 2));
}
flattenExerciseBaseData()
    .then(() => process.exit(0))
    .catch((err) => {
    console.error(err);
    process.exit(1);
});
