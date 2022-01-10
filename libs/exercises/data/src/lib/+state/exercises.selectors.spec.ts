import { ExercisesEntity } from './exercises.models';
import {
  exercisesAdapter,
  ExercisesPartialState,
  initialState,
} from './exercises.reducer';
import * as ExercisesSelectors from './exercises.selectors';

describe('Exercises Selectors', () => {
  const ERROR_MSG = 'No Error Available';
  const getExercisesId = (it: ExercisesEntity) => it.id;
  const createExercisesEntity = (id: string, name = '') =>
    ({
      id,
      name: name || `name-${id}`,
    } as ExercisesEntity);

  let state: ExercisesPartialState;

  beforeEach(() => {
    state = {
      exercises: exercisesAdapter.setAll(
        [
          createExercisesEntity('PRODUCT-AAA'),
          createExercisesEntity('PRODUCT-BBB'),
          createExercisesEntity('PRODUCT-CCC'),
        ],
        {
          ...initialState,
          selectedId: 'PRODUCT-BBB',
          error: ERROR_MSG,
          loaded: true,
        }
      ),
    };
  });

  describe('Exercises Selectors', () => {
    it('getAllExercises() should return the list of Exercises', () => {
      const results = ExercisesSelectors.getAllExercises(state);
      const selId = getExercisesId(results[1]);

      expect(results.length).toBe(3);
      expect(selId).toBe('PRODUCT-BBB');
    });

    it('getSelected() should return the selected Entity', () => {
      const result = ExercisesSelectors.getSelected(state) as ExercisesEntity;
      const selId = getExercisesId(result);

      expect(selId).toBe('PRODUCT-BBB');
    });

    it('getExercisesLoaded() should return the current "loaded" status', () => {
      const result = ExercisesSelectors.getExercisesLoaded(state);

      expect(result).toBe(true);
    });

    it('getExercisesError() should return the current "error" state', () => {
      const result = ExercisesSelectors.getExercisesError(state);

      expect(result).toBe(ERROR_MSG);
    });
  });
});
