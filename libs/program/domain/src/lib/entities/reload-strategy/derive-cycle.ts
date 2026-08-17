import { WeekPrescription } from '../models/week-prescription';
import { AnchorResolution } from './anchor-resolution';
import { RoundFn } from './round-to-increment';

/** Fixed sets×reps per week, independent of load — Reload's own prescribed template. */
const SETS_AND_REPS: Record<number, { sets: number; reps: number }> = {
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

  return [1, 2, 3, 4, 5, 6, 7].map((week) => ({
    week,
    load: loadForWeek(week),
    ...SETS_AND_REPS[week],
  }));
}
