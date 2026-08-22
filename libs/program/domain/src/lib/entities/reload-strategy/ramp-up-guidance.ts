import { LoadingConstraint } from '../models/loading-constraint';
import { RepMaxTest } from '../models/rep-max-test';
import { roundingFor, roundToIncrement } from './round-to-increment';
import { lookupWeeklyJumpAndBaseline } from './weekly-jump-table';

/**
 * Reload's expectation for a lifter's 5RM Goal, printed p.10: "Most likely that
 * goal-weight will be somewhere around 85 percent of 1RM +/- 3 percent, so somewhere
 * between 82 percent and 88 percent of 1RM."
 */
export const GOAL_ESTIMATE_PERCENT = 0.85;
export const GOAL_RANGE_PERCENT = { min: 0.82, max: 0.88 } as const;

/** Rungs of the ramp-up ladder to show. Seven carries a 4% lifter past the top of the goal band. */
const LADDER_RUNGS = 7;

export interface RampUpGuidance {
  /** One week's load increase, already in weight and on the gym's grid. */
  weeklyJump: number;
  /** The raw jump was smaller than the gym's increment, so it was clamped up to one increment. */
  jumpClampedToIncrement: boolean;
  /** Where the ramp-up test starts. This is not Week 1's load. */
  rampUpBaseline: number;
  /** Pre-fills the 5RM Goal field. An estimate, not a substitute for the ramp-up test. */
  suggestedGoal: number;
  /** A plausible 5RM Goal lands inside this band. Outside it, the form warns. */
  goalRange: { min: number; max: number };
  /** Successive ramp-up sets. The lifter climbs until five perfect reps fail. */
  ladder: number[];
}

/**
 * One week's load increase in weight, rounded once, up front. Reload Step 2.4 (printed
 * p.13): "Calculate your weekly jump, expressed in kilograms or pounds, and round it to
 * the closest weight available in your training facility."
 *
 * Takes no rounding mode, because it always rounds to nearest. The book says "closest"
 * every time it rounds, and a mode applied here compounds across all seven weeks rather
 * than shifting a single load. Rounding an 18lb jump down to 15lb costs the lifter 12lb
 * by Week 1 and another 12lb by Week 7.
 *
 * The clamp is ours, not the book's. A 2%-band lifter on 5kg plates gets a raw jump of
 * 2kg, which rounds to zero and would flatten every week to the same load. Reload heads
 * this off in Step 0 by telling the lifter to buy 1.25kg plates. We cannot, so we step by
 * one increment and let the form say so.
 */
export function calculateWeeklyJump(
  test: RepMaxTest,
  increment: number,
): { weeklyJump: number; jumpClampedToIncrement: boolean } {
  const { weeklyJumpPercent } = lookupWeeklyJumpAndBaseline(test.repsAt80Percent);
  const rounded = roundToIncrement(test.oneRepMax * weeklyJumpPercent, increment, 'nearest');
  return rounded < increment
    ? { weeklyJump: increment, jumpClampedToIncrement: true }
    : { weeklyJump: rounded, jumpClampedToIncrement: false };
}

/**
 * Everything a lifter needs to pick their 5RM Goal, derived from the 80%RM Test alone.
 * Feeds the form's pre-fill, its out-of-band warning, and the ramp-up ladder shown under
 * the field. None of it reaches the generated cycle, which needs only the goal and the
 * jump.
 */
export function calculateRampUpGuidance(input: {
  test: RepMaxTest;
  loadingConstraint: LoadingConstraint;
}): RampUpGuidance {
  const { test, loadingConstraint } = input;
  const round = roundingFor(loadingConstraint);
  const { rampUpBaselinePercent } = lookupWeeklyJumpAndBaseline(test.repsAt80Percent);
  const { weeklyJump, jumpClampedToIncrement } = calculateWeeklyJump(test, loadingConstraint.increment);
  const rampUpBaseline = round(test.oneRepMax * rampUpBaselinePercent);

  return {
    weeklyJump,
    jumpClampedToIncrement,
    rampUpBaseline,
    suggestedGoal: round(test.oneRepMax * GOAL_ESTIMATE_PERCENT),
    // Rounded outward rather than by the lifter's mode, so the band can only widen. Rounding
    // both edges the same way would shift it and warn on a goal sitting exactly on 82%.
    goalRange: {
      min: roundToIncrement(test.oneRepMax * GOAL_RANGE_PERCENT.min, loadingConstraint.increment, 'down'),
      max: roundToIncrement(test.oneRepMax * GOAL_RANGE_PERCENT.max, loadingConstraint.increment, 'up'),
    },
    ladder: Array.from({ length: LADDER_RUNGS }, (_, rung) => rampUpBaseline + rung * weeklyJump),
  };
}
