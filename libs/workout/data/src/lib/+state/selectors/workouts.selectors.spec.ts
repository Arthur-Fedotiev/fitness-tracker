import * as fromWorkouts from '../reducers/workouts.reducer';
import { selectWorkoutsState } from './workouts.selectors';

describe('Workouts Selectors', () => {
  it('should select the feature state', () => {
    const result = selectWorkoutsState({
      [fromWorkouts.workoutsFeatureKey]: {}
    });

    expect(result).toEqual({});
  });
});
