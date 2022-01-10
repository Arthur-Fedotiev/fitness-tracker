import { Action } from '@ngrx/store';

import * as ExercisesActions from './exercises.actions';
import { ExercisesEntity } from './exercises.models';
import { State, initialState, reducer } from './exercises.reducer';

describe('Exercises Reducer', () => {
  const createExercisesEntity = (id: string, name = ''): ExercisesEntity => ({
    id,
    name: name || `name-${id}`,
  });

  describe('valid Exercises actions', () => {
    it('loadExercisesSuccess should return the list of known Exercises', () => {
      const exercises = [
        createExercisesEntity('PRODUCT-AAA'),
        createExercisesEntity('PRODUCT-zzz'),
      ];
      const action = ExercisesActions.loadExercisesSuccess({ exercises });

      const result: State = reducer(initialState, action);

      expect(result.loaded).toBe(true);
      expect(result.ids.length).toBe(2);
    });
  });

  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as Action;

      const result = reducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });
});
