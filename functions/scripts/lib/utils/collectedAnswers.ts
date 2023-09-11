import { fromEvent, Observable } from 'rxjs';
import collectAnswers from './collectAnswers';
import { questions } from './constants';

const answerEvents = collectAnswers(questions);

export const collectedAnswers$: Observable<string[]> = fromEvent(
  answerEvents,
  'complete',
) as Observable<string[]>;
