import { LoadingConstraint } from '../models/loading-constraint';
import { RepMaxTest } from '../models/rep-max-test';
import { WeekPrescription } from '../models/week-prescription';
import { deriveCycle } from './derive-cycle';
import { calculateWeeklyJump } from './ramp-up-guidance';
import { roundingFor } from './round-to-increment';

export interface GenerateReloadCycleInput {
  test: RepMaxTest;
  loadingConstraint: LoadingConstraint;
  /** The lifter's 5RM Goal. Becomes Week 5's load, and every other week hangs off it. */
  fiveRepMaxGoal: number;
}

/**
 * The Strength Reload Strategy: turns one Main Lift Block's 80%RM Test and 5RM Goal into
 * an 8-week Reload Cycle's Weeks 1-7. Week 8 is a 1RM retest with no prescription and is
 * not part of this output.
 *
 * The goal is rounded here rather than at entry so a lifter's typo cannot put the whole
 * cycle off the gym's grid. For anyone who found their goal by ramp-up test it is already
 * a rung on that ladder, so the rounding does nothing.
 */
export function generateReloadCycle(input: GenerateReloadCycleInput): WeekPrescription[] {
  const round = roundingFor(input.loadingConstraint);
  const { weeklyJump } = calculateWeeklyJump(input.test, input.loadingConstraint.increment);
  return deriveCycle(round(input.fiveRepMaxGoal), weeklyJump);
}
