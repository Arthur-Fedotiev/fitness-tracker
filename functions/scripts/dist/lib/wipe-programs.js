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
const node_fs_1 = require("node:fs");
const admin = __importStar(require("firebase-admin"));
const PROGRAMS_COLLECTION = 'programs';
const BATCH_LIMIT = 500;
const certPath = process.argv[2] ?? './sa.json';
const commit = process.argv.includes('--commit');
/** The cert picks the project, so report it back from the cert rather than from ambient config. */
const projectId = JSON.parse((0, node_fs_1.readFileSync)(certPath, 'utf8')).project_id ?? 'unknown';
admin.initializeApp({
    credential: admin.credential.cert(certPath),
});
const db = admin.firestore();
/**
 * One-time wipe for ADR-0010 (five-rep-max-goal-is-tested-not-derived): deletes every
 * `programs/{id}` document.
 *
 * Saved Programs carry cycles built by the old derivation, which ran up to 7% of 1RM
 * light with uneven week-to-week gaps, and blocks shaped around fields that no longer
 * exist (`anchorSource`, `manualWeek5`). The Training Planner had not shipped, so we
 * agreed to clear the collection rather than write a migration for data nobody trained
 * off. A fresh Program regenerates under the corrected math.
 *
 * The service-account cert picks the project, so this never inherits whatever `firebase
 * use` happens to be pointing at. That matters here, because `firebase use` in this repo
 * resolves to the prod alias rather than `.firebaserc`'s default.
 *
 * Idempotent: an already-empty collection deletes nothing and reports zero.
 * Uses `firebase-admin`, which bypasses Firestore rules.
 *
 * Usage: `node dist/lib/wipe-programs.js <path-to-service-account-json> [--commit]`
 * Dry-run by default. Run against `./sa.json` (fitness-tracker-ui-dev) first, review the
 * count, `--commit`, then repeat against `./sa.prod.json` (fitness-tracker-de06b).
 */
async function wipePrograms() {
    const snapshot = await db.collection(PROGRAMS_COLLECTION).get();
    let deleted = 0;
    let batch = db.batch();
    let batchSize = 0;
    const flush = async () => {
        if (batchSize === 0)
            return;
        if (commit)
            await batch.commit();
        batch = db.batch();
        batchSize = 0;
    };
    for (const doc of snapshot.docs) {
        const { name, status, userId } = doc.data();
        console.log(`${commit ? 'DELETE' : 'DRY-RUN delete'} programs/${doc.id} ` +
            `(name="${name ?? '?'}", status=${status ?? '?'}, userId=${userId ?? '?'})`);
        batch.delete(doc.ref);
        batchSize += 1;
        deleted += 1;
        if (batchSize === BATCH_LIMIT)
            await flush();
    }
    await flush();
    console.log(JSON.stringify({
        project: projectId,
        certPath,
        mode: commit ? 'commit' : 'dry-run',
        found: snapshot.size,
        deleted: commit ? deleted : 0,
        wouldDelete: commit ? 0 : deleted,
    }, null, 2));
}
wipePrograms()
    .then(() => process.exit(0))
    .catch((error) => {
    console.error(error);
    process.exit(1);
});
