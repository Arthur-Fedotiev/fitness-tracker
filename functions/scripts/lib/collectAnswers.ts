// using readline and event handlers for making a question-answering app.

import readline from 'readline'
import { EventEmitter } from 'events';
import { Questions } from './utils/models';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const isNotAnsweredAll = (
  { length: answersLength }: string[], { length: questionsLength }: Questions): boolean => answersLength < questionsLength;

export default (questions: Questions) => {
  const answers: string[] = [];
  const [firstQuestion] = questions;
  const emitter = new EventEmitter();

  const questionAnswered = (answer: string) => {
    emitter.emit('answer', answer);
    answers.push(answer);
    isNotAnsweredAll(answers, questions)
      ? rl.question(questions[answers.length], questionAnswered)
      : emitter.emit('complete', answers);
  };

  rl.question(firstQuestion, questionAnswered);

  return emitter;
};
