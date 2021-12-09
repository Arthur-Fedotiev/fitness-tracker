import { last, Observable, scan, Subject } from 'rxjs';
import readline from 'readline'
import { Answers, Questions } from './utils/models';


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const answersSbj = new Subject<string>();

const completeProcess = () => {
  console.log("Thank you for your answers.");
  answersSbj.complete();
}

export const collectAnswers = (questions: Questions) => {
  let answered = 0;

  const questionAnswered = (answer: string) => {
    answered++;
    answersSbj.next(answer)

    answered < questions.length ? rl.question(questions[answered], questionAnswered) : completeProcess();
  };

  rl.question(questions[0], questionAnswered);

};

export const answers$: Observable<Answers> = answersSbj.asObservable().pipe(
  scan((answers: Answers, answer: string) => [...answers, answer], []),
  last()
)
