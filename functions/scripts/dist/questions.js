"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.answers$ = exports.collectAnswers = void 0;
var rxjs_1 = require("rxjs");
var readline_1 = __importDefault(require("readline"));
var rl = readline_1.default.createInterface({
    input: process.stdin,
    output: process.stdout
});
var answersSbj = new rxjs_1.Subject();
var completeProcess = function () {
    console.log("Thank you for your answers.");
    answersSbj.complete();
};
var collectAnswers = function (questions) {
    var answered = 0;
    var questionAnswered = function (answer) {
        answered++;
        answersSbj.next(answer);
        answered < questions.length ? rl.question(questions[answered], questionAnswered) : completeProcess();
    };
    rl.question(questions[0], questionAnswered);
};
exports.collectAnswers = collectAnswers;
exports.answers$ = answersSbj.asObservable().pipe((0, rxjs_1.scan)(function (answers, answer) { return __spreadArray(__spreadArray([], answers, true), [answer], false); }, []), (0, rxjs_1.last)());
