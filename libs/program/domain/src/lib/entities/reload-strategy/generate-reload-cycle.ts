import { AnchorSource } from '../models/anchor-source';
import { LoadingConstraint } from '../models/loading-constraint';
import { RepMaxTest } from '../models/rep-max-test';
import { WeekPrescription } from '../models/week-prescription';
import { resolveAnchor } from './anchor-resolution';
import { deriveCycle } from './derive-cycle';
import { roundingFor } from './round-to-increment';

export interface GenerateReloadCycleInput {
  test: RepMaxTest;
  loadingConstraint: LoadingConstraint;
  /** A lifter-entered Week 5 override, if any — cascades to the whole cycle. */
  manualWeek5: number | null;
}

export interface GeneratedReloadCycle {
  anchorSource: AnchorSource;
  cycle: WeekPrescription[];
}

/**
 * The Strength Reload Strategy: turns one Main Lift Block's Rep Max Test (plus an
 * optional Manual Week 5 override) into an 8-week Reload Cycle's Weeks 1–7 — the
 * public entry point over {@link resolveAnchor} and {@link deriveCycle}. Week 8 has no
 * prescription (a retest) and isn't part of this output.
 */
export function generateReloadCycle(input: GenerateReloadCycleInput): GeneratedReloadCycle {
  const round = roundingFor(input.loadingConstraint);
  const anchor = resolveAnchor({ test: input.test, manualWeek5: input.manualWeek5 }, round);
  const cycle = deriveCycle(anchor, input.test.oneRepMax, round);
  return { anchorSource: anchor.source, cycle };
}
