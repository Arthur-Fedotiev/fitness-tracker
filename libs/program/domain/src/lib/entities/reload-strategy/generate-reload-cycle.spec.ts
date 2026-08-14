import { LoadingConstraint } from '../models/loading-constraint';
import { RepMaxTest } from '../models/rep-max-test';
import { WeekPrescription } from '../models/week-prescription';
import { generateReloadCycle } from './generate-reload-cycle';
import { lookupWeeklyJumpAndBaseline } from './weekly-jump-table';

// Minimum test checklist mandated by
// .scratch/strength-reload-calculator/issues/05-testing-approach-calculation-engine.md
// (14 cases across 5 requirements). Each `it` names the requirement row it satisfies.

function loadOf(cycle: WeekPrescription[], week: number): number | null {
  return cycle.find((w) => w.week === week)?.load ?? null;
}

const constraint = (increment: number, roundingMode: LoadingConstraint['roundingMode']): LoadingConstraint => ({
  increment,
  roundingMode,
});

describe('Requirement 1: table boundary cutoffs (reps 5, 6, 8, 9, 10, 11)', () => {
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

describe('Requirement 2: anchor-source convergence (placeholder, table-driven, manual)', () => {
  const loadingConstraint = constraint(1, 'nearest');

  it('placeholder anchor (no reps result yet) — only Week 5 is knowable', () => {
    const test: RepMaxTest = { oneRepMax: 100, repsAt80Percent: null };

    const { anchorSource, cycle } = generateReloadCycle({ test, loadingConstraint, manualWeek5: null });

    expect(anchorSource).toBe('placeholder');
    expect(loadOf(cycle, 5)).toBe(85); // round(100 × 0.85)
    expect(loadOf(cycle, 1)).toBeNull();
    expect(loadOf(cycle, 4)).toBeNull();
    expect(loadOf(cycle, 6)).toBeNull();
    expect(loadOf(cycle, 7)).toBeNull();
  });

  it('table-driven anchor derives Weeks 1–4 backward and 6–7 upward by one Weekly Jump', () => {
    const test: RepMaxTest = { oneRepMax: 100, repsAt80Percent: 7 }; // 6–8 band: 4% jump, 65% baseline

    const { anchorSource, cycle } = generateReloadCycle({ test, loadingConstraint, manualWeek5: null });

    expect(anchorSource).toBe('table');
    expect(loadOf(cycle, 5)).toBe(81); // round(100 × (0.65 + 4×0.04))
    expect(loadOf(cycle, 4)).toBe(77);
    expect(loadOf(cycle, 3)).toBe(73);
    expect(loadOf(cycle, 2)).toBe(69);
    expect(loadOf(cycle, 1)).toBe(65);
    expect(loadOf(cycle, 6)).toBe(85);
    expect(loadOf(cycle, 7)).toBe(89);
  });

  it('manual anchor derives the same backward/upward pattern around the overridden Week 5', () => {
    const test: RepMaxTest = { oneRepMax: 100, repsAt80Percent: 7 };

    const { anchorSource, cycle } = generateReloadCycle({ test, loadingConstraint, manualWeek5: 90 });

    expect(anchorSource).toBe('manual');
    expect(loadOf(cycle, 5)).toBe(90);
    expect(loadOf(cycle, 4)).toBe(86);
    expect(loadOf(cycle, 3)).toBe(82);
    expect(loadOf(cycle, 2)).toBe(78);
    expect(loadOf(cycle, 1)).toBe(74);
    expect(loadOf(cycle, 6)).toBe(94);
    expect(loadOf(cycle, 7)).toBe(98);
  });
});

describe('Requirement 3: Manual override on Week 5 cascades to Weeks 1–4 and 6–7', () => {
  it('recomputes every other week relative to the override, not just the Week 5 cell', () => {
    const test: RepMaxTest = { oneRepMax: 100, repsAt80Percent: 7 };
    const loadingConstraint = constraint(1, 'nearest');

    const tableDriven = generateReloadCycle({ test, loadingConstraint, manualWeek5: null });
    const manuallyOverridden = generateReloadCycle({ test, loadingConstraint, manualWeek5: 100 });

    expect(loadOf(manuallyOverridden.cycle, 5)).toBe(100);
    // Weeks away from the anchor moved too — proof this isn't a single-cell-only override.
    expect(loadOf(manuallyOverridden.cycle, 1)).toBe(84);
    expect(loadOf(manuallyOverridden.cycle, 1)).not.toBe(loadOf(tableDriven.cycle, 1));
    expect(loadOf(manuallyOverridden.cycle, 7)).toBe(108);
    expect(loadOf(manuallyOverridden.cycle, 7)).not.toBe(loadOf(tableDriven.cycle, 7));
  });
});

describe('Requirement 4: rounding modes interacting with the derivation', () => {
  it('nearest rounds nearest fixture (101, reps 7, ×2.5 increment) up to 82.5', () => {
    const test: RepMaxTest = { oneRepMax: 101, repsAt80Percent: 7 };
    const loadingConstraint = constraint(2.5, 'nearest');

    const { cycle } = generateReloadCycle({ test, loadingConstraint, manualWeek5: null });

    expect(loadOf(cycle, 5)).toBe(82.5); // raw 81.81 → 32.724 increments → nearest 33 → 82.5
  });

  it('down truncates the same fixture to 80 instead of rounding up', () => {
    const test: RepMaxTest = { oneRepMax: 101, repsAt80Percent: 7 };
    const loadingConstraint = constraint(2.5, 'down');

    const { cycle } = generateReloadCycle({ test, loadingConstraint, manualWeek5: null });

    expect(loadOf(cycle, 5)).toBe(80); // 32.724 increments → floor 32 → 80
  });

  it('up rounds a fixture (99, reps 7, ×2.5 increment) to 82.5 where nearest would round down', () => {
    const test: RepMaxTest = { oneRepMax: 99, repsAt80Percent: 7 };
    const loadingConstraint = constraint(2.5, 'up');

    const { cycle } = generateReloadCycle({ test, loadingConstraint, manualWeek5: null });

    expect(loadOf(cycle, 5)).toBe(82.5); // raw 80.19 → 32.076 increments → ceil 33 → 82.5
  });
});

describe('Requirement 5: rounding-collision is tolerated, not a bug', () => {
  it('lets two adjacent weeks collapse to the same displayed load under a coarse increment', () => {
    const test: RepMaxTest = { oneRepMax: 100, repsAt80Percent: 11 }; // >10 band: 2% jump
    const loadingConstraint = constraint(5, 'nearest');

    const { cycle } = generateReloadCycle({ test, loadingConstraint, manualWeek5: null });

    expect(loadOf(cycle, 5)).toBe(85); // raw 83 → 16.6 increments → nearest 17 → 85
    expect(loadOf(cycle, 6)).toBe(85); // raw 85 → 17 increments exactly → 85, same as Week 5
  });
});
