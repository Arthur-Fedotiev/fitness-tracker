/**
 * A lifter's 1RM plus the reps achieved on the 80%1RM AMRAP set. Between them they fix
 * the Weekly Jump and the Ramp-up Baseline, via Reload's table (printed p.11).
 *
 * Both are required. The Weekly Jump is `1RM x jumpPercent`, so dropping either one
 * leaves every week except the 5RM Goal itself unknowable.
 */
export interface RepMaxTest {
  oneRepMax: number;
  repsAt80Percent: number;
}
