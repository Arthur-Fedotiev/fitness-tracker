import * as fromWorkouts from './workouts.actions';

describe('loadWorkoutss', () => {
  it('should return an action', () => {
    expect(fromWorkouts.loadWorkoutss().type).toBe('[Workouts] Load Workoutss');
  });
});
