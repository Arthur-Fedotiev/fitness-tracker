# The 5RM Goal is tested by the lifter, not derived from 1RM

Our Reload Cycle generator calculated Week 5 as `1RM × (rampUpBaseline% + 4 × weeklyJump%)`, then rounded each week's total to the Loading Constraint. Checking both against the source, Tsatsouline & Zonin's _Reload: Your Barbell Strength Blueprint_, neither is in the book. On the book's own worked example (1RM 450lb, 8 reps @80%, 5lb plates, printed pp.13-18) our output was 295 / 310 / 330 / 345 / 365 / 385 / 400 against the printed 315 / 335 / 355 / 375 / 395 / 415 / 435: every week 20 to 35lb light, with uneven gaps and repeated loads.

Two root causes. The book never derives Week 5. It is the 5/5@#5 goal, found by a physical ramp-up test where the lifter climbs from the Ramp-up Baseline in Weekly Jump steps until 5 perfect reps fail. And the book rounds its *inputs* to available plates, the 80%1RM, the Weekly Jump and the Ramp-up Baseline, then builds the cycle by plain addition. Rounding each week's total instead is what let neighbouring weeks collapse onto the same load. We had codified that collapse as intended behaviour in a test named "rounding-collision is tolerated, not a bug", and the lookup table's docblock claimed the derivation was "verified exact" against the book when only the table itself had been checked.

So the lifter now enters their 5RM Goal, we round the Weekly Jump once up front, and every week is one jump from its neighbour. The `placeholder` and `table` anchor sources are gone along with `AnchorSource` itself, since there is only one way in.

## Considered options

Deriving Week 5 and keeping the ramp-up test optional was the obvious alternative, and we spent a real cost rejecting it: the lifter now owes a test session they did not owe before, and a blank required field is a worse first run than a pre-filled one. We took it because no formula reproduces the book's own example, and a number that is silently 7% of 1RM light across an entire 8-week cycle is worse than asking for a number the lifter can actually measure.

To soften that cost we pre-fill the field with `1RM × 0.85` and warn outside 82% to 88%. That range is the book's, printed p.10: "Most likely that goal-weight will be somewhere around 85 percent of 1RM ± 3 percent." Note that `1RM × 0.85` was the old `placeholder` anchor. It turned out to be the book-grounded formula all along, while the `table` one we trusted was the invention.

## Consequences

- Rounding mode applies to the 5RM Goal and the Ramp-up Baseline only. The Weekly Jump always rounds to nearest, because a mode applied there compounds across seven weeks rather than shifting one load.
- A jump rounding below the gym's increment is clamped up to one increment, so a cycle cannot flatten to a single repeated load. This is ours, not the book's, which instead tells the lifter to buy 1.25kg plates (Step 0, printed p.12). The form says so when the clamp fires.
- `CONTEXT.md` defined `Ramp-up Baseline` as "the Week 1 starting load", the misreading that seeded the derivation. It is the ramp-up test's starting weight and appears nowhere in a generated cycle.
- `RepMaxTest.oneRepMax`, `repsAt80Percent` and `WeekPrescription.load` are no longer nullable, and `manualWeek5` is now `fiveRepMaxGoal`. We wiped saved Programs in both Firebase projects rather than migrating them, since the feature had not shipped.
- One test pins the book's printed worked example so our arithmetic cannot drift from the source again. The rest of the suite checks the code against itself, which is exactly how the previous derivation survived.
