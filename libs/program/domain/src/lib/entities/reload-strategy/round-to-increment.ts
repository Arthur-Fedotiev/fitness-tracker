import { RoundingMode } from '../models/rounding-mode';

export type RoundFn = (value: number) => number;

/**
 * Rounds a weight to a gym's available jump (a Loading Constraint).
 *
 * Only ever applied to an input: the 5RM Goal, the Ramp-up Baseline, the Weekly Jump.
 * Never to a week's load, which is derived from two already-rounded numbers. Rounding
 * week totals is what used to let two adjacent weeks collapse onto the same load, and
 * that was a bug rather than the tolerated behaviour a previous version of this comment
 * claimed. See ADR-0010.
 */
export function roundToIncrement(value: number, increment: number, mode: RoundingMode): number {
  if (!increment || increment <= 0) {
    return Math.round(value);
  }
  const steps = value / increment;
  const roundedSteps = mode === 'down' ? Math.floor(steps) : mode === 'up' ? Math.ceil(steps) : Math.round(steps);
  return Math.round(roundedSteps * increment * 100) / 100;
}

export function roundingFor(loadingConstraint: { increment: number; roundingMode: RoundingMode }): RoundFn {
  return (value: number) => roundToIncrement(value, loadingConstraint.increment, loadingConstraint.roundingMode);
}
