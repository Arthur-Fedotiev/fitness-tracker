import { RoundingMode } from '../models/rounding-mode';

export type RoundFn = (value: number) => number;

/**
 * Rounds a calculated load to a gym's available weight jump (a Loading Constraint).
 * Two adjacent weeks landing on the same displayed load after rounding is expected,
 * tolerated behaviour — see .scratch/strength-reload-calculator/issues/05-testing-approach-calculation-engine.md.
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
