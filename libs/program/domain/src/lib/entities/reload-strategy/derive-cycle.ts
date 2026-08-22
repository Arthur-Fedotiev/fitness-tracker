import { WeekPrescription } from '../models/week-prescription';

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
 * Weeks 1-7 from the lifter's 5RM Goal. Reload's Step-by-Step Plan Design (printed
 * p.16): "Assign your 5/5@#5 goal as the training load of week 5", then "count backward
 * from week 5 to week 1 and subtract, week by week, your weekly jump" and "count forward
 * from week 5 to week 7 and add, week by week, your weekly jump".
 *
 * Both arguments are already rounded to the gym's grid, so nothing is rounded here. That
 * placement is the whole point. Rounding each week's total instead lets two neighbouring
 * weeks land on the same load, and makes the gaps uneven.
 */
export function deriveCycle(fiveRepMaxGoal: number, weeklyJump: number): WeekPrescription[] {
  return PRESCRIBED_WEEKS.map((week) => ({
    week,
    load: fiveRepMaxGoal + (week - 5) * weeklyJump,
    ...SETS_AND_REPS[week],
  }));
}
