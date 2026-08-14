import { AnchorSource } from '../models/anchor-source';
import { RepMaxTest } from '../models/rep-max-test';
import { RoundFn } from './round-to-increment';
import { lookupWeeklyJumpAndBaseline } from './weekly-jump-table';

/**
 * Week 5's resolved anchor load plus the Weekly Jump % that carries the rest of the
 * cycle — the single seam every anchor source (placeholder / table / manual) funnels
 * through before {@link deriveCycle} runs the identical backward/upward derivation on
 * top of it. See .scratch/strength-reload-calculator/issues/01-weekly-jump-week5-formula.md:
 * "there's no per-source branching downstream of Week 5".
 */
export interface AnchorResolution {
  source: AnchorSource;
  week5: number;
  /** Null only when neither a completed Test nor a Manual override can supply it. */
  weeklyJumpPercent: number | null;
}

/** Pre-Test estimate — Reload's Appendix B table has no entry until reps@80%1RM is known. */
function resolvePlaceholderAnchor(oneRepMax: number, round: RoundFn): AnchorResolution {
  return { source: 'placeholder', week5: round(oneRepMax * 0.85), weeklyJumpPercent: null };
}

/** Week5 = round(1RM × (rampUpBaseline% + 4 × weeklyJump%)), looked up by reps@80%1RM. */
function resolveTableAnchor(oneRepMax: number, repsAt80Percent: number, round: RoundFn): AnchorResolution {
  const { weeklyJumpPercent, rampUpBaselinePercent } = lookupWeeklyJumpAndBaseline(repsAt80Percent);
  const week5 = round(oneRepMax * (rampUpBaselinePercent + 4 * weeklyJumpPercent));
  return { source: 'table', week5, weeklyJumpPercent };
}

/**
 * A lifter-entered Week 5 override. Still needs a completed Test to know the Weekly
 * Jump % for the rest of the cycle — the override alone only supplies Week 5 itself.
 */
function resolveManualAnchor(manualWeek5: number, repsAt80Percent: number | null): AnchorResolution {
  const weeklyJumpPercent =
    repsAt80Percent != null ? lookupWeeklyJumpAndBaseline(repsAt80Percent).weeklyJumpPercent : null;
  return { source: 'manual', week5: manualWeek5, weeklyJumpPercent };
}

export function resolveAnchor(
  input: { test: RepMaxTest; manualWeek5: number | null },
  round: RoundFn,
): AnchorResolution {
  const { oneRepMax, repsAt80Percent } = input.test;

  if (input.manualWeek5 != null) {
    return resolveManualAnchor(input.manualWeek5, repsAt80Percent);
  }
  // Outside Manual override the UI requires 1RM — reachable only if a caller bypasses it.
  if (oneRepMax == null) {
    throw new Error('oneRepMax is required outside Manual override');
  }
  if (repsAt80Percent != null) {
    return resolveTableAnchor(oneRepMax, repsAt80Percent, round);
  }
  return resolvePlaceholderAnchor(oneRepMax, round);
}
