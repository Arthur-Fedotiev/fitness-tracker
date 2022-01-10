"use strict";
// using readline and event handlers for making a question-answering app.
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var readline_1 = __importDefault(require("readline"));
var events_1 = require("events");
var rl = readline_1.default.createInterface({
    input: process.stdin,
    output: process.stdout
});
var isNotAnsweredAll = function (_a, _b) {
    var answersLength = _a.length;
    var questionsLength = _b.length;
    return answersLength < questionsLength;
};
exports.default = (function (questions) {
    var answers = [];
    var firstQuestion = questions[0];
    var emitter = new events_1.EventEmitter();
    var questionAnswered = function (answer) {
        emitter.emit('answer', answer);
        answers.push(answer);
        isNotAnsweredAll(answers, questions)
            ? rl.question(questions[answers.length], questionAnswered)
            : emitter.emit('complete', answers);
    };
    rl.question(firstQuestion, questionAnswered);
    return emitter;
});
