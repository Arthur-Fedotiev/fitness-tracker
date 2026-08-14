# Testing/QA approach for the calculation engine

Type: grilling
Status: resolved
Blocked by: 01

## Question

Now that the Weekly Jump / Week 5 anchor model is settled ([Weekly Jump / Week 5 formula](01-weekly-jump-week5-formula.md)), decide what the spec must require test-wise for the Reload Cycle calculation:

1. Table boundary coverage: does the spec require explicit test cases at each rep-band boundary (5 vs 6, 8 vs 9, 10 vs 11) to pin the `≤5` / `6–8` / `9–10` / `>10` cutoffs?
2. Anchor-source coverage: does the spec require separate test cases for each of the three Week 5 anchor sources (Option A placeholder, table-driven, Manual) confirming they all feed the identical backward/upward derivation?
3. Override-cascade coverage: does the spec require a test proving a Manual override on Week 5 recomputes Weeks 1–4 and 6–7, not just Week 5 itself?
4. Rounding/Loading Constraint coverage: does the spec require tests for each rounding mode (nearest/down/up) and increment interacting with the backward/upward derivation, including cases where rounding could make two adjacent weeks compute to the same displayed load?
5. Where do these live — spec-level acceptance criteria only, or does the spec also mandate specific unit test cases for whichever domain lib implements the Strength Reload Strategy?

## Answer

All five questions resolve to "yes, require it," each scoped to a minimum case count rather than an exhaustive cross-product:

1. **Table boundary coverage — yes, all six values.** Explicit test cases at reps = 5, 6, 8, 9, 10, 11, pinning the `≤5` / `6–8` / `9–10` / `>10` cutoffs. An inclusive/exclusive slip here would silently diverge from the source table (verified exact against StrongFirst's Appendix B in [01](01-weekly-jump-week5-formula.md); the band's direction was corrected from a "≥5" transcription typo to "≤5" during spec compilation, see [01](01-weekly-jump-week5-formula.md)'s Answer) with nothing else to catch it.

2. **Anchor-source coverage — yes, one representative case per source (3 total).** Option A placeholder, table-driven, and Manual each get one case proving they feed the identical backward/upward derivation. Not a full boundary cross-product per source — Q1 already owns exhaustive table-cutoff coverage, so re-running all four bands through all three sources would be redundant volume, not more confidence.

3. **Override-cascade coverage — yes, mandatory, 1 case, highest priority.** A test proving a Manual override on Week 5 recomputes Weeks 1–4 and 6–7, not just the Week 5 cell. [01](01-weekly-jump-week5-formula.md)'s answer explicitly frames Weeks 1–4 as backward-derived (rather than forward-from-baseline) *specifically* so Manual override cascades correctly — a regression here would silently revert to single-cell-only behavior with no other test catching it.

4. **Rounding/Loading Constraint coverage — yes, one case per rounding mode (3 total), plus one collision case.** One test per mode (nearest/down/up) applied to the derivation is enough — not a full mode × increment cross-product, since the three modes are independent branches wrapping math already covered by 1–3.

   **Rounding-collision behavior (surfaced during grilling, not in the original ticket text):** when rounding collapses two adjacent weeks' *displayed* loads to the same number, that's **acceptable behavior, not a bug** — a legitimate consequence of a small Weekly Jump % meeting a coarse Loading Constraint increment (e.g. a 2% jump against 2.5kg plates). No artificial minimum-delta rule is introduced to prevent it; a test asserts the collapse is tolerated.

5. **Where these live — both, not duplicated.** `spec.md` states 1–4 above as acceptance criteria (the source of truth for *what* must hold). The `program-domain` implementation is required to ship an actual unit test suite for the Strength Reload Strategy satisfying every one of them — not spec text alone with tests deferred. Concrete minimum checklist:

   | # | Requirement | Min. cases |
   |---|---|---|
   | 1 | Table boundary cutoffs (reps = 5, 6, 8, 9, 10, 11) | 6 |
   | 2 | Anchor-source convergence (Option A, table-driven, Manual) | 3 |
   | 3 | Manual override cascades Weeks 1–4 & 6–7 | 1 |
   | 4 | Rounding modes (nearest/down/up) | 3 |
   | 5 | Rounding-collision tolerated, not a bug | 1 |

   **14 minimum test cases**, each traceable to one of the acceptance criteria above.

Decided in conversation with the user (grilling session, voice-transcribed answers), 2026-08-12.
