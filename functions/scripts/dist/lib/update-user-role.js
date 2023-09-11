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
const rxjs_1 = require("rxjs");
const constants_1 = require("./utils/constants");
const collectedAnswers_1 = require("./utils/collectedAnswers");
async function updateUserRole(userUid, role) {
    await admin
        .auth()
        .setCustomUserClaims(userUid, { admin: role === shared_package_1.ROLES.ADMIN, role });
    console.log(`\n${constants_1.successIcon}  User role is now ${role}.\n`);
}
const updateUserRole$ = (userUid, role) => (0, rxjs_1.from)(updateUserRole(userUid, role));
collectedAnswers_1.collectedAnswers$
    .pipe((0, rxjs_1.tap)(([serviceAccountPath]) => admin.initializeApp({
    credential: admin.credential.cert(serviceAccountPath),
})), (0, rxjs_1.switchMap)(([_, userUid, role]) => updateUserRole$(userUid, role)), (0, rxjs_1.finalize)(() => process.exit()), (0, rxjs_1.catchError)((err) => {
    console.error(`${constants_1.failureIcon} ${err?.message}`);
    return (0, rxjs_1.throwError)(() => err);
}), (0, rxjs_1.first)())
    .subscribe();
