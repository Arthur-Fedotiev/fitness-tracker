"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.collectedAnswers$ = void 0;
var rxjs_1 = require("rxjs");
var collectAnswers_1 = __importDefault(require("./collectAnswers"));
var constants_1 = require("./utils/constants");
var answerEvents = (0, collectAnswers_1.default)(constants_1.questions);
exports.collectedAnswers$ = (0, rxjs_1.fromEvent)(answerEvents, 'complete');
