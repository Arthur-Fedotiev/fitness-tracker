/**
 * A lifter's 1RM plus the reps achieved on the 80%1RM AMRAP set — the two inputs the
 * Strength Reload table (Appendix B) is keyed on.
 *
 * Both fields are nullable because a Manual Week 5 override needs neither: `week5` comes
 * straight from the override, and Weeks 1–4/6–7 only derive when a Weekly Jump % is
 * knowable (from `repsAt80Percent`) *and* `oneRepMax` is present to scale it — otherwise
 * they stay unknown rather than risk a silently-wrong number. Outside Manual override,
 * the UI requires both fields (the pre-Test "placeholder" anchor from
 * .scratch/strength-reload-calculator/issues/01-weekly-jump-week5-formula.md — 1RM alone,
 * no reps — is a domain capability the UI no longer exposes, not one that was removed).
 */
export interface RepMaxTest {
  oneRepMax: number | null;
  repsAt80Percent: number | null;
}

/** A RepMaxTest whose reps result is known, unlocking the table-driven anchor. */
export type CompletedRepMaxTest = RepMaxTest & { repsAt80Percent: number };
