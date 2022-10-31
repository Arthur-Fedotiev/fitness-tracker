"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
var admin = __importStar(require("firebase-admin"));
var rxjs_1 = require("rxjs");
var update_user_role_1 = require("./lib/update-user-role");
var collectedAnswers_1 = require("./lib/collectedAnswers");
var operators_1 = require("rxjs/operators");
var constants_1 = require("./lib/utils/constants");
collectedAnswers_1.collectedAnswers$.pipe((0, rxjs_1.tap)(function (_a) {
    var serviceAccountPath = _a[0];
    return admin.initializeApp({
        credential: admin.credential.cert(serviceAccountPath),
    });
}), (0, rxjs_1.switchMap)(function (_a) {
    var _ = _a[0], userUid = _a[1], role = _a[2];
    return (0, update_user_role_1.updateUserRole$)(userUid, role);
}), (0, operators_1.finalize)(function () { return process.exit(); }), (0, operators_1.catchError)(function (err) {
    console.error("".concat(constants_1.failureIcon, " ").concat(err === null || err === void 0 ? void 0 : err.message));
    return (0, rxjs_1.throwError)(function () { return err; });
}), (0, operators_1.first)()).subscribe();
