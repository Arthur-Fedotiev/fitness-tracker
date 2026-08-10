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
// Read-only survey. Does not write, update, or delete anything.
const certPath = process.argv[2] ?? './sa.json';
admin.initializeApp({
    credential: admin.credential.cert(certPath),
});
const db = admin.firestore();
/**
 * Read-only audit of the `exercises` collection's legacy translation shapes.
 *
 * Written to de-risk the ADR-0002 (remove multilanguage support) deploy: the
 * app reads `baseData.name`/`baseData.instructions` directly, but
 * `flatten-exercise-translations.ts` only recovers content from a
 * `translations` subcollection or a `translatedData` field — and in
 * practice neither ever matched live data. Some documents instead carry an
 * even older `translatableData` field that script never looks at. This
 * reports, per document, which shapes are actually present, so a deploy can
 * be confirmed safe (or a real gap found and patched) before it ships.
 *
 * Usage: `node dist/lib/survey-exercise-shapes.js <path-to-service-account-json>`
 * Every call is `.get()` — makes no writes.
 */
async function surveyExerciseShapes() {
    const exercisesSnapshot = await db.collection(shared_package_1.COLLECTIONS.EXERCISES).get();
    let total = 0;
    let hasSubcollection = 0;
    let hasTranslatedData = 0;
    let hasTranslatableData = 0;
    let baseDataComplete = 0;
    let baseDataMissingName = 0;
    let baseDataMissingInstructions = 0;
    let noRecoverableContent = 0;
    const incompleteIds = [];
    for (const doc of exercisesSnapshot.docs) {
        total++;
        const data = doc.data();
        const baseData = data.baseData ?? {};
        const translationsSnap = await doc.ref.collection(shared_package_1.COLLECTIONS.TRANSLATIONS).get();
        const hasSubcollectionDocs = !translationsSnap.empty;
        if (hasSubcollectionDocs)
            hasSubcollection++;
        if (data.translatedData != null)
            hasTranslatedData++;
        if (data.translatableData != null)
            hasTranslatableData++;
        const hasName = typeof baseData.name === 'string' && baseData.name.length > 0;
        const hasInstructions = Array.isArray(baseData.instructions) && baseData.instructions.length > 0;
        if (hasName && hasInstructions) {
            baseDataComplete++;
        }
        else {
            if (!hasName)
                baseDataMissingName++;
            if (!hasInstructions)
                baseDataMissingInstructions++;
            const recoverableFromScript = hasSubcollectionDocs || Boolean(data.translatedData?.name?.en);
            if (!recoverableFromScript)
                noRecoverableContent++;
            incompleteIds.push(`${doc.id} — name:${hasName} instructions:${hasInstructions} subcollection:${hasSubcollectionDocs} translatedData:${data.translatedData != null} translatableData:${data.translatableData != null}`);
        }
    }
    console.log('--- Incomplete docs ---');
    incompleteIds.forEach((line) => console.log(line));
    console.log('\n--- Survey summary ---');
    console.log(JSON.stringify({
        total,
        hasSubcollection,
        hasTranslatedData,
        hasTranslatableData,
        baseDataComplete,
        baseDataMissingName,
        baseDataMissingInstructions,
        noRecoverableContent,
    }, null, 2));
}
surveyExerciseShapes()
    .then(() => process.exit(0))
    .catch((err) => {
    console.error(err);
    process.exit(1);
});
