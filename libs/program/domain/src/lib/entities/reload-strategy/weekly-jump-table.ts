/**
 * The Strength Reload Weekly Jump / Ramp-up Baseline lookup table, keyed by reps
 * achieved on the 80%1RM AMRAP set. Checked against the table printed on p.11 of
 * Tsatsouline & Zonin's _Reload: Your Barbell Strength Blueprint_.
 *
 * The bands below are the book's. What used to be built on top of them was not: a
 * derivation of Week 5 from `rampUpBaseline + 4 × weeklyJump` carried the same
 * "verified exact" claim as this table while appearing nowhere in the book. See
 * ADR-0010. Checking the table is not checking what reads it.
 *
 *   Reps @ 80%1RM | Weekly Jump | Ramp-up Baseline
 *   ≤5             | 5%          | 60%
 *   6–8            | 4%          | 65%
 *   9–10           | 3%          | 70%
 *   >10            | 2%          | 75%
 */
export interface WeeklyJumpAndBaseline {
  weeklyJumpPercent: number;
  rampUpBaselinePercent: number;
}

export function lookupWeeklyJumpAndBaseline(repsAt80Percent: number): WeeklyJumpAndBaseline {
  if (repsAt80Percent <= 5) return { weeklyJumpPercent: 0.05, rampUpBaselinePercent: 0.6 };
  if (repsAt80Percent <= 8) return { weeklyJumpPercent: 0.04, rampUpBaselinePercent: 0.65 };
  if (repsAt80Percent <= 10) return { weeklyJumpPercent: 0.03, rampUpBaselinePercent: 0.7 };
  return { weeklyJumpPercent: 0.02, rampUpBaselinePercent: 0.75 };
}
