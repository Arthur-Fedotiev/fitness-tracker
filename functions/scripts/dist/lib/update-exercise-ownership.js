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
exports.updateExerciseOwnership = void 0;
const admin = __importStar(require("firebase-admin"));
const shared_package_1 = require("shared-package");
admin.initializeApp({
    credential: admin.credential.cert('./sa.prod.json'),
});
const db = admin.firestore();
async function updateExerciseOwnership() {
    try {
        await db.runTransaction(async (transaction) => {
            const exerciseCollectionSnapshot = await transaction.get(db.collection(shared_package_1.COLLECTIONS.EXERCISES));
            await Promise.all(exerciseCollectionSnapshot.docs.map((doc) => {
                const data = doc.data();
                if (data.baseData.userId === undefined ||
                    data.baseData.admin === undefined) {
                    transaction.update(doc.ref, {
                        baseData: {
                            ...data.baseData,
                            userId: null,
                            admin: true,
                        },
                    });
                }
            }));
        });
        console.log('done');
    }
    catch (err) {
        console.error(err);
    }
}
exports.updateExerciseOwnership = updateExerciseOwnership;
updateExerciseOwnership();
