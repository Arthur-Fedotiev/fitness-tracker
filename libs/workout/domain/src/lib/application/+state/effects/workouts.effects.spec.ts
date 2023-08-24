import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { WorkoutsEffects } from './workouts.effects';

describe('WorkoutsEffects', () => {
  let actions$: Observable<any>;
  let effects: WorkoutsEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        WorkoutsEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.inject(WorkoutsEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
