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
exports.flattenExerciseTranslations = void 0;
const admin = __importStar(require("firebase-admin"));
const shared_package_1 = require("shared-package");
const ENGLISH = 'en';
// The 5.2.0 shared-package tarball these scripts depend on predates
// INSTRUCTIONS_DELIMITER's addition to the package, so it's inlined here.
const INSTRUCTIONS_DELIMITER = '___';
const fromTranslatedData = (translatedData) => {
    const name = translatedData?.name?.[ENGLISH];
    const instructions = translatedData?.instructions?.[ENGLISH];
    if (!name || !instructions)
        return null;
    return {
        name,
        instructions: instructions
            .split(INSTRUCTIONS_DELIMITER)
            .map((instruction) => instruction.trim()),
    };
};
const certPath = process.argv[2] ?? './sa.json';
admin.initializeApp({
    credential: admin.credential.cert(certPath),
});
const db = admin.firestore();
async function flattenExerciseTranslations() {
    try {
        await db.runTransaction(async (transaction) => {
            const exercisesSnapshot = await transaction.get(db.collection(shared_package_1.COLLECTIONS.EXERCISES));
            const translationSnapshots = await Promise.all(exercisesSnapshot.docs.map((doc) => transaction.get(doc.ref.collection(shared_package_1.COLLECTIONS.TRANSLATIONS))));
            exercisesSnapshot.docs.forEach((doc, i) => {
                const translationDocs = translationSnapshots[i].docs;
                const englishTranslation = translationDocs.find((translationDoc) => translationDoc.id === ENGLISH);
                const englishContent = englishTranslation
                    ? (({ name, instructions }) => ({ name, instructions }))(englishTranslation.data())
                    : fromTranslatedData(doc.data().translatedData);
                if (!englishContent) {
                    console.warn(`No English content for exercise ${doc.id}, skipping.`);
                    return;
                }
                console.log(`Flattening exercise ${doc.id}: ${englishContent.name}` +
                    (englishTranslation ? '' : ' (recovered from translatedData)'));
                transaction.update(doc.ref, {
                    baseData: {
                        ...doc.data().baseData,
                        ...englishContent,
                    },
                    translatedData: admin.firestore.FieldValue.delete(),
                });
                translationDocs.forEach((translationDoc) => transaction.delete(translationDoc.ref));
            });
        });
        console.log('done');
    }
    catch (err) {
        console.error(err);
    }
}
exports.flattenExerciseTranslations = flattenExerciseTranslations;
flattenExerciseTranslations();
