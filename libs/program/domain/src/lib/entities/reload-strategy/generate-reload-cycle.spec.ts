import { LoadingConstraint } from '../models/loading-constraint';
import { RepMaxTest } from '../models/rep-max-test';
import { WeekPrescription } from '../models/week-prescription';
import { generateReloadCycle } from './generate-reload-cycle';
import { calculateRampUpGuidance, calculateWeeklyJump } from './ramp-up-guidance';
import { lookupWeeklyJumpAndBaseline } from './weekly-jump-table';

function loadsOf(cycle: WeekPrescription[]): number[] {
  return cycle.map((week) => week.load);
}

function gapsOf(cycle: WeekPrescription[]): number[] {
  const loads = loadsOf(cycle);
  return loads.slice(1).map((load, index) => Math.round((load - loads[index]) * 100) / 100);
}

function loadOfWeek(cycle: WeekPrescription[], week: number): number | undefined {
  return cycle.find((prescription) => prescription.week === week)?.load;
}

const constraint = (increment: number, roundingMode: LoadingConstraint['roundingMode']): LoadingConstraint => ({
  increment,
  roundingMode,
});

describe('the Weekly Jump / Ramp-up Baseline table', () => {
  it('reps=5 falls in the ≤5 band (5% / 60%)', () => {
    expect(lookupWeeklyJumpAndBaseline(5)).toEqual({ weeklyJumpPercent: 0.05, rampUpBaselinePercent: 0.6 });
  });

  it('reps=6 falls in the 6–8 band (4% / 65%)', () => {
    expect(lookupWeeklyJumpAndBaseline(6)).toEqual({ weeklyJumpPercent: 0.04, rampUpBaselinePercent: 0.65 });
  });

  it('reps=8 stays in the 6–8 band at its upper edge', () => {
    expect(lookupWeeklyJumpAndBaseline(8)).toEqual({ weeklyJumpPercent: 0.04, rampUpBaselinePercent: 0.65 });
  });

  it('reps=9 falls in the 9–10 band (3% / 70%)', () => {
    expect(lookupWeeklyJumpAndBaseline(9)).toEqual({ weeklyJumpPercent: 0.03, rampUpBaselinePercent: 0.7 });
  });

  it('reps=10 stays in the 9–10 band at its upper edge', () => {
    expect(lookupWeeklyJumpAndBaseline(10)).toEqual({ weeklyJumpPercent: 0.03, rampUpBaselinePercent: 0.7 });
  });

  it('reps=11 crosses into the >10 band (2% / 75%)', () => {
    expect(lookupWeeklyJumpAndBaseline(11)).toEqual({ weeklyJumpPercent: 0.02, rampUpBaselinePercent: 0.75 });
  });
});

/**
 * The one group here that can catch our arithmetic drifting away from the source. Every
 * other case checks the code against itself, which is how the previous derivation shipped
 * with a docblock claiming it was verified.
 *
 * Reload, Step-by-Step Pre-testing (printed p.13) and Plan Design (printed p.16). Smaller
 * plates available: 2.5lb, so the smallest available weight jump is 5lb.
 */
describe("Reload's own printed worked example (1RM 450lb, 8 reps, 5lb jumps)", () => {
  const test: RepMaxTest = { oneRepMax: 450, repsAt80Percent: 8 };
  const loadingConstraint = constraint(5, 'nearest');

  it('rounds the weekly jump to 20lb, as the book does (450 × .04 = 18lb)', () => {
    expect(calculateWeeklyJump(test, 5)).toEqual({ weeklyJump: 20, jumpClampedToIncrement: false });
  });

  it('rounds the ramp-up baseline to 295lb, as the book does (450 × .65 = 292.5lb)', () => {
    expect(calculateRampUpGuidance({ test, loadingConstraint }).rampUpBaseline).toBe(295);
  });

  it('reproduces the printed cycle from the tested 5/5@#5 goal of 395lb', () => {
    const cycle = generateReloadCycle({ test, loadingConstraint, fiveRepMaxGoal: 395 });

    expect(loadsOf(cycle)).toEqual([315, 335, 355, 375, 395, 415, 435]);
  });

  it('ramps up to the tested goal in one-jump steps from the baseline', () => {
    const { ladder } = calculateRampUpGuidance({ test, loadingConstraint });

    expect(ladder.slice(0, 6)).toEqual([295, 315, 335, 355, 375, 395]);
  });
});

describe('deriving the cycle from the 5RM Goal', () => {
  const test: RepMaxTest = { oneRepMax: 200, repsAt80Percent: 8 };
  const loadingConstraint = constraint(2.5, 'nearest');

  it('derives Weeks 1–4 backward and 6–7 upward by one weekly jump each', () => {
    const cycle = generateReloadCycle({ test, loadingConstraint, fiveRepMaxGoal: 170 });

    expect(loadsOf(cycle)).toEqual([140, 147.5, 155, 162.5, 170, 177.5, 185]);
  });

  it('carries the prescribed sets and reps, with 3×3 in Week 6 and 2×2 in Week 7', () => {
    const cycle = generateReloadCycle({ test, loadingConstraint, fiveRepMaxGoal: 170 });

    expect(cycle.map(({ week, sets, reps }) => ({ week, sets, reps }))).toEqual([
      { week: 1, sets: 5, reps: 5 },
      { week: 2, sets: 5, reps: 5 },
      { week: 3, sets: 5, reps: 5 },
      { week: 4, sets: 5, reps: 5 },
      { week: 5, sets: 5, reps: 5 },
      { week: 6, sets: 3, reps: 3 },
      { week: 7, sets: 2, reps: 2 },
    ]);
  });

  it('shifts the whole cycle when the goal changes, not just the Week 5 cell', () => {
    const lighter = generateReloadCycle({ test, loadingConstraint, fiveRepMaxGoal: 170 });
    const heavier = generateReloadCycle({ test, loadingConstraint, fiveRepMaxGoal: 180 });

    expect(loadsOf(heavier)).toEqual(loadsOf(lighter).map((load) => load + 10));
  });
});

describe('rounding happens to the inputs, never to a week total', () => {
  const test: RepMaxTest = { oneRepMax: 200, repsAt80Percent: 8 };

  it('rounds a goal that sits off the gym grid before deriving from it', () => {
    const cycle = generateReloadCycle({ test, loadingConstraint: constraint(2.5, 'nearest'), fiveRepMaxGoal: 171 });

    expect(loadOfWeek(cycle, 5)).toBe(170);
  });

  it('honours a down rounding mode on the goal', () => {
    const cycle = generateReloadCycle({ test, loadingConstraint: constraint(5, 'down'), fiveRepMaxGoal: 174 });

    expect(loadOfWeek(cycle, 5)).toBe(170);
  });

  /**
   * The mode governs the goal and the baseline, never the jump. Reload says "closest"
   * every time it rounds, and a mode applied to the jump compounds across all seven weeks.
   * A 'down' mode here would round 18lb to 15lb and pull Week 1 down to 335lb.
   */
  it('rounds the weekly jump to nearest even when the mode says down', () => {
    const bookExample: RepMaxTest = { oneRepMax: 450, repsAt80Percent: 8 };
    const cycle = generateReloadCycle({
      test: bookExample,
      loadingConstraint: constraint(5, 'down'),
      fiveRepMaxGoal: 395,
    });

    expect(gapsOf(cycle)).toEqual([20, 20, 20, 20, 20, 20]);
    expect(loadsOf(cycle)).toEqual([315, 335, 355, 375, 395, 415, 435]);
  });
});

describe('every week is one whole jump apart, with no repeats', () => {
  it('keeps the gaps even under a coarse increment that used to collapse two weeks', () => {
    // The fixture that previously produced 75, 80, 80, 85, 85, 85, 90.
    const test: RepMaxTest = { oneRepMax: 100, repsAt80Percent: 11 };
    const cycle = generateReloadCycle({ test, loadingConstraint: constraint(5, 'nearest'), fiveRepMaxGoal: 85 });

    expect(gapsOf(cycle)).toEqual([5, 5, 5, 5, 5, 5]);
    expect(new Set(loadsOf(cycle)).size).toBe(7);
  });

  it('clamps a jump smaller than the increment up to one increment, rather than flattening the cycle', () => {
    // 100 × 2% = 2, which rounds to 0 against a 5 increment and would repeat 85 seven times.
    expect(calculateWeeklyJump({ oneRepMax: 100, repsAt80Percent: 11 }, 5)).toEqual({
      weeklyJump: 5,
      jumpClampedToIncrement: true,
    });
  });

  it('leaves a fractional jump alone when the increment can express it', () => {
    expect(calculateWeeklyJump({ oneRepMax: 200, repsAt80Percent: 8 }, 2.5)).toEqual({
      weeklyJump: 7.5,
      jumpClampedToIncrement: false,
    });
  });
});

describe('guidance for picking a 5RM Goal', () => {
  const test: RepMaxTest = { oneRepMax: 200, repsAt80Percent: 8 };
  const loadingConstraint = constraint(2.5, 'nearest');

  it('suggests 85% of 1RM, per Reload printed p.10', () => {
    expect(calculateRampUpGuidance({ test, loadingConstraint }).suggestedGoal).toBe(170);
  });

  it('brackets a plausible goal between 82% and 88% of 1RM', () => {
    // Rounded outward, so 164 and 176 both stay inside the band rather than being warned about.
    expect(calculateRampUpGuidance({ test, loadingConstraint }).goalRange).toEqual({ min: 162.5, max: 177.5 });
  });

  it('widens the band rather than shifting it when the lifter rounds up', () => {
    const roundingUp = calculateRampUpGuidance({ test, loadingConstraint: constraint(2.5, 'up') });

    expect(roundingUp.goalRange).toEqual({ min: 162.5, max: 177.5 });
  });

  it("keeps the ramp-up baseline clear of Week 1's load, which sits a whole jump above it", () => {
    const guidance = calculateRampUpGuidance({ test, loadingConstraint });
    const cycle = generateReloadCycle({ test, loadingConstraint, fiveRepMaxGoal: guidance.suggestedGoal });

    expect(guidance.rampUpBaseline).toBe(130);
    expect(loadOfWeek(cycle, 1)).toBe(140);
  });
});
