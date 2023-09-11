"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const readline_1 = __importDefault(require("readline"));
const events_1 = require("events");
const rl = readline_1.default.createInterface({
    input: process.stdin,
    output: process.stdout,
});
const isNotAnsweredAll = ({ length: answersLength }, { length: questionsLength }) => answersLength < questionsLength;
exports.default = (questions) => {
    const answers = [];
    const [firstQuestion] = questions;
    const emitter = new events_1.EventEmitter();
    const questionAnswered = (answer) => {
        emitter.emit('answer', answer);
        answers.push(answer);
        isNotAnsweredAll(answers, questions)
            ? rl.question(questions[answers.length], questionAnswered)
            : emitter.emit('complete', answers);
    };
    rl.question(firstQuestion, questionAnswered);
    return emitter;
};
