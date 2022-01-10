import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { NxModule } from '@nrwl/angular';
import { hot } from 'jasmine-marbles';
import { Observable } from 'rxjs';

import * as ExercisesActions from './exercises.actions';
import { ExercisesEffects } from './exercises.effects';

describe('ExercisesEffects', () => {
  let actions: Observable<Action>;
  let effects: ExercisesEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NxModule.forRoot()],
      providers: [
        ExercisesEffects,
        provideMockActions(() => actions),
        provideMockStore(),
      ],
    });

    effects = TestBed.inject(ExercisesEffects);
  });

  describe('init$', () => {
    it('should work', () => {
      actions = hot('-a-|', { a: ExercisesActions.init() });

      const expected = hot('-a-|', {
        a: ExercisesActions.loadExercisesSuccess({ exercises: [] }),
      });

      expect(effects.init$).toBeObservable(expected);
    });
  });
});
