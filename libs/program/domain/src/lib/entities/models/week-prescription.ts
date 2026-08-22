/**
 * One week's row in a generated Reload Cycle. Weeks 1-7 only, since Week 8 is a 1RM
 * retest and carries no prescription.
 */
export interface WeekPrescription {
  week: number;
  load: number;
  sets: number;
  reps: number;
}
