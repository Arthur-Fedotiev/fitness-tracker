# Weekly Jump / Week 5 formula

Type: grilling
Status: resolved

## Question

The loose spec gives a simplified Week 5 auto-suggestion formula ("Option A"): `Week5Suggested = roundToIncrement(1RM × 0.85)`. The real source method (Tsatsouline & Zonin, _Reload_) computes this differently: the 80%RM Test's reps result looks up both a Ramp-up Baseline (%1RM) and a Weekly Jump (%1RM) from a fixed table, and Week 5's load is the Ramp-up Baseline plus four Weekly Jumps.

Decide:

1. Is Option A (`1RM × 0.85`) the actual, permanent Week 5 auto-suggestion — or is it a placeholder shown before the lifter has entered/completed an 80%RM Test, with the table-driven calculation taking over once they have?
2. How are Weeks 1–4 computed: ramping up from the Ramp-up Baseline by one Weekly Jump per week (matching the source method), or backward from Week 5 by subtracting one Weekly Jump per week?
3. When the lifter switches to Manual and overrides Week 5, does that override cascade — do Weeks 1–4 (and anything derived from Week 5, like Weeks 6–7) recompute relative to the manual value, or does Manual only replace the single Week 5 cell?
4. Confirm the lookup table to implement:

   | RM @ 80%1RM | Weekly Jump (% 1RM) | Ramp-up Baseline (% 1RM) |
   |---|---|---|
   | ≤5 | 5% | 60% |
   | 6–8 | 4% | 65% |
   | 9–10 | 3% | 70% |
   | >10 | 2% | 75% |

## Answer

**The anchor model.** Week 5 is the single anchor load for the whole Reload Cycle, however it's established. Weeks 1–4 are derived **backward** from the Week 5 anchor by subtracting one Weekly Jump per week (Week 4 = Week 5 − Jump, … Week 1 = Week 5 − 4×Jump). Weeks 6–7 are derived **upward** from the same anchor by adding one Weekly Jump per week (Week 6 = Week 5 + Jump, Week 7 = Week 5 + 2×Jump). One Weekly Jump percentage drives both directions — there's a single derivation rule, not a separate one per direction.

This supersedes the "ramp forward from the Ramp-up Baseline" framing in root `CONTEXT.md`'s Reload Cycle definition — CONTEXT.md is being updated alongside this ticket to match.

1. **Option A is a pre-Test placeholder, not a permanent alternative.** It's shown only while an Exercise Block has no completed 80%RM Test (the table lookup needs the Test's rep result, which doesn't exist yet). The moment the Test is entered, the table-driven anchor (Ramp-up Baseline + 4×Weekly Jump) permanently supersedes it. Manual entry is a third source for the same anchor. All three sources — Option A, table-driven, Manual — feed the identical backward/upward derivation to the rest of the cycle; there's no per-source branching downstream of Week 5.
2. **Weeks 1–4 are computed backward from the Week 5 anchor**, not forward from the Ramp-up Baseline. (Value-identical to a forward ramp in the untouched table-driven case, since Week 5 = Baseline + 4×Jump — but the backward framing is what makes Manual override behave correctly, see below.)
3. **Manual override on Week 5 cascades.** Typing a new Week 5 value replaces the anchor outright — Weeks 1–4 and 6–7 all recompute relative to the new value. There is no "single-cell only" mode.
4. **Lookup table confirmed exact**, verified against StrongFirst's own published Appendix B PDF (`Reload – Your Barbell Strength Blueprint` Appendix B, Tables and Templates) — table above matches with no additional rows. **Correction (2026-08-12, during spec compilation):** the first band was originally transcribed as "≥5" reps, which overlaps the "6–8" band and doesn't match the working prototype code (`apps/fitness-tracker/src/app/prototype-training-planner/model.ts`'s `lookupJumpBaseline`, which treats reps `< 6` as this band). Corrected to "≤5" here and in [Testing/QA approach](05-testing-approach-calculation-engine.md) — a voice-transcription artifact, not a re-decision; confirmed with the user before editing.
5. **Weeks 6–7 load rule** (surfaced during grilling, not in the original spec text): confirmed via the book's own text (secondary-sourced) — _"Establish the weights in weeks 6 and 7 by counting forward from the weight on week 5"_ — i.e. the same upward derivation described in the anchor model above, not a separate fixed percentage. Well-corroborated (book-text quote + independent forum worked example) but not confirmed against a scan of the physical book page.

Decided in conversation with the user (voice-transcribed answers, 2026-08-11).
