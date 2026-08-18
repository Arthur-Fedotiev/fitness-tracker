import { WeekPrescription } from '../models/week-prescription';
import { AnchorResolution } from './anchor-resolution';
import { RoundFn } from './round-to-increment';

/**
 * The weeks that carry a prescription. Week 8 is a 1RM retest, so it has none and is
 * absent here — anything rendering an 8-week grid adds it separately.
 */
export const PRESCRIBED_WEEKS = [1, 2, 3, 4, 5, 6, 7] as const;

/** One of the weeks {@link PRESCRIBED_WEEKS} lists. */
export type PrescribedWeek = (typeof PRESCRIBED_WEEKS)[number];

/**
 * Fixed sets×reps per week, independent of load — Reload's own prescribed template.
 *
 * Keyed on {@link PrescribedWeek} rather than `number`, so the two can't drift: adding a
 * week to {@link PRESCRIBED_WEEKS} fails to compile until it has a prescription here, and
 * a prescription for a week that list doesn't cover fails too. It also stops a nonsense
 * lookup like `SETS_AND_REPS[99]` type-checking as if it were defined.
 */
export const SETS_AND_REPS: Record<PrescribedWeek, { sets: number; reps: number }> = {
  1: { sets: 5, reps: 5 },
  2: { sets: 5, reps: 5 },
  3: { sets: 5, reps: 5 },
  4: { sets: 5, reps: 5 },
  5: { sets: 5, reps: 5 },
  6: { sets: 3, reps: 3 },
  7: { sets: 2, reps: 2 },
};

/**
 * Weeks 1–7 from a resolved anchor: Weeks 1–4 derive backward from Week 5 by
 * subtracting one Weekly Jump per week, Weeks 6–7 derive upward by adding one — the
 * same rule in both directions, applied identically regardless of anchor source.
 */
export function deriveCycle(anchor: AnchorResolution, oneRepMax: number | null, round: RoundFn): WeekPrescription[] {
  const weeklyJump =
    anchor.weeklyJumpPercent != null && oneRepMax != null ? oneRepMax * anchor.weeklyJumpPercent : null;

  const loadForWeek = (week: number): number | null => {
    if (week === 5) return anchor.week5;
    if (weeklyJump == null) return null;
    const jumpsFromWeek5 = week - 5;
    return round(anchor.week5 + jumpsFromWeek5 * weeklyJump);
  };

  return PRESCRIBED_WEEKS.map((week) => ({
    week,
    load: loadForWeek(week),
    ...SETS_AND_REPS[week],
  }));
}
