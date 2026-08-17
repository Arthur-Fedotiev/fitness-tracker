/**
 * One week's row in a generated Reload Cycle (Weeks 1–7 — Week 8 is a retest, no
 * prescription). `load` is null only under the pre-Test placeholder anchor, where
 * just Week 5 is knowable — see anchor-resolution.ts.
 */
export interface WeekPrescription {
  week: number;
  load: number | null;
  sets: number;
  reps: number;
}
