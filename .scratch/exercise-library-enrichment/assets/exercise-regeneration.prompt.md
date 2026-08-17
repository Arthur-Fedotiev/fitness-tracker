# Exercise library regeneration prompt

Ready to run. Paste everything from "## Task" down into ChatGPT (or use it as the `input` of an API call with `response_format` set to the schema in `exercise-regeneration.schema.json`, `strict: true`). See "How to run this" at the bottom for batching guidance if running via the chat UI instead of the API.

---

## Task

You are regenerating the entire admin-owned exercise library for a fitness-tracking app. Two things are true at once:

1. **Every exercise listed under "Existing exercises to regenerate" below already exists** as a Firestore document, identified by its `id`. You are replacing its content — instructions, exercise type, target muscles, equipment — with fresh, accurate, well-written content. Some of this existing data is known to be wrong (see "Known data quality issues" below) — don't defer to it, verify it.
2. **You are also adding new exercises** that are missing from the list: popular main lifts, powerlifts, Olympic lifts, and functional/conditioning movements not already covered by name below.

Output **one JSON object** matching the schema in `exercise-regeneration.schema.json` — a single top-level `{"exercises": [...]}` array containing every regenerated existing exercise plus every new one. No markdown, no commentary, no text outside the JSON.

## Output rules

- **`id`**: copy verbatim from the input list for every regenerated exercise. Use `null` only for a genuinely new exercise with no existing document.
- **`name`**: keep the recognizable identity of the exercise for regenerated entries — a user has real workout history logged against this document. Fixing stray leading/trailing whitespace, casing, or an obvious typo is fine (e.g. `" Dumbbell Bench Press"` → `"Dumbbell Bench Press"`). Do not turn it into a different movement.
- **`exerciseType`**, **`targetMuscles`**, **`equipment`**: must be exactly one (or, for `targetMuscles`, one or more) of the enum values below — no new values, no synonyms, no casing variants.
- **`instructions`**: 3+ ordered, numbered-in-spirit cues as separate array elements — not one paragraph. Written for someone who has never done the movement: setup, execution, common cue/mistake to avoid.
- **Duplicates across the two lists**: the same real-world exercise (e.g. "Clean and jerk") appears twice below — once for staging, once for prod — as two separate documents with two different `id`s. Regenerate both as separate entries in the output, but give them identical content (same `instructions`, `exerciseType`, `targetMuscles`, `equipment`), since they're the same movement.
- **Don't duplicate new exercises that already exist**: before adding a "missing" popular lift, check it's not already in the existing list under a different name/spelling (e.g. don't add "Deadlift" — `Barbell Deadlift`, `Romanian Deadlift`, `Sumo Deadlift`, etc. already exist; do add `Overhead Press` and `Wall Ball Shot` if you find them absent, as they aren't in the list below).

## Taxonomy (exhaustive — use only these values)

**exerciseType** (pick exactly one):
`CARDIO`, `OLYMPIC_WEIGHTLIFTING`, `PLYOMETRICS`, `POWERLIFTING`, `STRENGTH`, `STRETCHING`, `STRONGMAN`, `FUNCTIONAL`

Line-drawing for the ambiguous cases: sled pushes/pulls, wall balls, and other conditioning/circuit movements → `FUNCTIONAL`. Classic strongman events (farmer's walk, carries, yoke) → `STRONGMAN`. Box jumps and other explosive jump/hop work → `PLYOMETRICS`. The competition barbell lifts (snatch, clean, clean & jerk, and their variants/pulls) → `OLYMPIC_WEIGHTLIFTING`. Squat/bench/deadlift and their close variants → `POWERLIFTING` if trained as a competition lift, `STRENGTH` if it's an accessory/hypertrophy variant (e.g. Romanian deadlift → `STRENGTH`, competition-style barbell deadlift → `POWERLIFTING`).

**targetMuscles** (array, one or more of):
`NECK`, `TRAPS`, `SHOULDERS`, `CHEST`, `BICEPS`, `FOREARM`, `ABDOMINAL`, `OBLIQUES`, `QUADRICEPS`, `HIP_FLEXORS`, `ADDUCTORS`, `ABDUCTORS`, `CALVES`, `TRICEPS`, `LATS`, `MIDDLE_BACK`, `LOWER_BACK`, `GLUTES`, `HAMSTRINGS`

List every muscle actually loaded, primary first — a full-body Olympic lift or a sled push legitimately lists several. Don't pad with tangential assistance muscles.

**equipment** (pick exactly one):
`BANDS`, `ROLL`, `BARBELL`, `KETTLEBELLS`, `BODY_ONLY`, `MACHINE`, `CABLE`, `MEDICINE_BALL`, `DUMBBELL`, `NONE`, `E-Z_BAR`, `OTHER`, `EXERCISE_BALL`, `SLED`, `TRAP_BAR`, `ROWER`, `JUMP_ROPE`, `BATTLE_ROPES`, `BOX`, `SANDBAG`

## Known data quality issues (fix these, don't preserve them)

14 of the 158 existing documents have a corrupted `targetMuscle` — the value is an equipment name (`BARBELL`, `DUMBBELL`, `CABLE`) or the literal string `"NULL"`, not a real muscle. These are flagged inline in the list below with `⚠ corrupted targetMuscle: <bad value>` — when you see that marker, ignore the bad value entirely and classify `targetMuscles` from scratch based on the exercise name and your own knowledge of the movement.

## Existing exercises to regenerate

### staging (`fitness-tracker-ui-dev`) — 30 admin-owned

- YU0OsilcsOcShRsxBxbS  Army Press
- UNpo9QQILw9SQOsWteZW  Backlash with dumbbells
- uwmFYB7iuAB9Md8PZT05  Barbell Full Squat
- g8dQFk0ShMBBvqYAhssm  Clean and jerk
- VCoUwhU8K24j1Lr9woQg  Clean and press
- sOpycaYVvSb77b0MorPQ  Dumbbell Bench Press
- Fm711XnYTSGbxJJ5yyjL  Dumbbell front raise to lateral raise
- Eeml5n8krX1BAVhU4UfS  Dumbbell Split Squats
- xVj0QjER65bVtMXJ4a3q  Incline dumbbell reverse fly
- L1LQLD3sGLpRNVhGOKz8  Kettlebell One-Legged Deadlift
- rYoFv3hjUHf0XYhCw8er  Kettlebell pass-through lunge
- xcFQONAoI1Uxpdom5vXn  Lying Leg Curls
- 62mLNNGG6BRvG4i7jnaq  Machine Squat
- yaobzHAhP2HoWlqHQ4Sg  Overhead dumbbell front raise
- 0wdI8mA5fp4cO56AXIVe  Power Partials
- KSziWkgJxpZSV3I3VQxt  Pull Through
- 5fxEsLbhvHDzti3Fd4nK  Romanian Deadlift With Dumbbells
- 19Ss8L9HbthogLHd8PMH  Seated barbell shoulder press
- 2bKPrMbdChjkXB0CpfN5  Seated Calf Raise
- zhs8zCnx2hNeoO5HNQ0s  Seated Dumbbell Press
- ed7Rr4vGqZOQfFZUOaT0  Seated dumbbell shoulder press
- 1enG7NNpaRvS6wHSfw60  Single-arm lateral raise
- wGM4frto4Ecpc29EYPVw  Single-arm palm-in dumbbell shoulder press
- rKzGeH39INBTQXdbzYze  Single-leg cable hip extension
- 4WYdDy46jT8BHB0MCq1Z  Single-leg glute bridge
- kS5vd7LPqqaAN2EDlt3X  Smith Machine Calf Raise
- 09cXvqfTsVHF8U4MJ5cF  Standing dumbbell shoulder press
- WzZGYginDjjVHT0fR6HA  Standing palms-in shoulder press
- JTHcvVuKZVMKqsxPFzJQ  Step-up with knee raise
- eKlkZYOAOMcaj4uZ4ulQ  T-Bar Row with Handle

### prod (`fitness-tracker-de06b`) — 128 admin-owned

- d6epfDILHtF2E5JA6J2t  90/90 Hamstring
- W1gA68QqZp3bibC74RNo  Alternating lunge jump
- UNpo9QQILw9SQOsWteZW  Backlash with dumbbells
- QuA3rZoMZveje9g0gHL7  Band Good Morning (Pull Through)
- jfnvpZZwJB0is6FoRjh3  Barbell Deadlift
- MFBt1kDCCpV6H760p8RS  Barbell glute bridge
- OzKNUfbE9nvCGejJD1ec  Barbell glute bridge
- OzhWHRW7p1nyTsHYxqq5  Barbell glute bridge
- yUeXBpLfMOEO7ss2K9Gg  Barbell glute bridge  ⚠ corrupted targetMuscle: BARBELL
- Ag9IAkQbfOD6MyfAzVoR  Barbell Hip Thrust
- wWvGSbJRTdRNlAKPJ4YR  Barbell stiff-legged deadlift
- uLij3Av9sWTL1m15mbDf  Box jump
- UBbPRxffUM3oAMRbtSUe  Box Jump (Multiple Response)
- Z80wUUpQ7b3sYa0t8xeg  Calf Press On The Leg Press Machine
- r66UQv9q32lpRMRZBzPo  Clean
- 8Pep7jwUuAwW16vMjHpF  Clean and jerk
- OyDbSyalbjXjQycV6ugX  Clean and press
- EFmlcwhOzOgszU8Cc2kS  Clean Deadlift
- VILQv96CwyzVFrabjlZ3  Downward Facing Balance
- sOpycaYVvSb77b0MorPQ  Dumbbell Bench Press
- h3DCO4sMIPQjUsgWrJYk  Dumbbell Clean
- P79ipMqHbEe7gCx4EnpO  Dumbbell farmer's walk  ⚠ corrupted targetMuscle: OTHER
- QM0W7VWu3gXDqT2M7h6l  Dumbbell front raise to lateral raise
- aNajfnYib0yGZS1xJSTY  Dumbbell Lying Pronation  ⚠ corrupted targetMuscle: NULL
- nl5VR8HcwZtdXuTQvoew  Dumbbell Lying Supination  ⚠ corrupted targetMuscle: NULL
- Eeml5n8krX1BAVhU4UfS  Dumbbell Split Squats
- pT7FzpBvPALb9Uj8HjcU  Exercise ball hip thrust
- L1dF7KkJn5BxwpEvpesM  Exercise ball leg curl
- 5CAwhV2v3XmVoiSrZMz3  Flutter Kicks
- 20N0Kj06Dt8HNfhytekq  Full squat with a barbell
- TFKKU3RXXe8TLErpS4Q6  Glute bridge
- pW7ZVUEhM2vTJ9MGePQh  Glute Bridge Hamstring Walkout
- K4NTJ79gyCYdl0cZJ53u  Glute Ham Raise
- iXWh3AMmWpukZtmnb7ns  Glute ham raise-
- SM2nEPukuIXHvPXN8YDK  Glute Kickback
- q0ubvGbqeqiYkKtzDNmw  Good Morning
- mCnmJ1l9vnXXqKHI62n4  Good Morning off Pins
- GCPOdW0ELH1h0nGTxNGQ  Hamstring-SMR
- DGHDHB8tQvT0hYqfjj8P  Hang Snatch
- dUgkfz2Y1RvSSG3ldDYa  Hip Extension with Bands
- zIfihgPQWBIXe7ggL0dh  Hip Lift with Band
- VqEgd3phZh0kB6LGx5ZS  Hurdle Hops
- 5pYpBMBKzqG30e9JVmRh  Inchworm
- FBHIzPsQBCZmCroQwVy7  Incline dumbbell reverse fly
- L1LQLD3sGLpRNVhGOKz8  Kettlebell One-Legged Deadlift
- pBwhaEwaGfhHrcZ4iifC  Kettlebell One-Legged Deadlift
- rYoFv3hjUHf0XYhCw8er  Kettlebell pass-through lunge
- bNLXD2Snjvoqx5Pi04Qs  Kettlebell thruster
- rO5IEa0aA7yhksNaAZ4G  Knee Across The Body
- tDBWBjzN0e1jY39nCD2X  Knee Across The Body
- b18XOfh2rYWKUtPfUOlD  Knee Tuck Jump
- qXkRbvSgB9rRWEEsslV3  Kneeling Jump Squat
- LWPRjxvQXTwsYFvth7J1  Kneeling Squat
- WOvifnyGvWZKPdsdh9Za  Leg-Up Hamstring Stretch
- orOm5IzWczA4RJbHbOFq  Linear Acceleration Wall Drill
- oLNPzVuge1VNfpTPxYGn  Lying Glute
- NlB8r4HceACeTfyo7VsD  Lying glute stretch
- voB7m8kcpwvTA20pKV4A  Lying groin stretch with band
- BPwOxIQmScLBPn5M8GJJ  Lying Hamstring
- xcFQONAoI1Uxpdom5vXn  Lying Leg Curls
- 62mLNNGG6BRvG4i7jnaq  Machine Squat
- Cu1N9uenYbMVg22DYJGG  Military press
- FRtgWAWhe5Q7eXTe2Hpr  Military press
- PFGjG1dFo0i2v7t4ouAS  Military press
- weskePICvW3QtoSiaOVG  Military press
- fex6EVbTeCqOABoJhl9j  Moving Claw Series
- RVeWs4uR8UuEc8vXNk4s  Natural Glute Ham Raise
- AZfWiWjzHzIB1LXLoiC8  Neck Bridge Supine
- a0K9R2ftTxzg1ZjsEdFr  One Knee To Chest
- ia9LYi5hJF8xejiUN7I7  Overhead dumbbell front raise
- y321XgRvxWKUFvQfdpaZ  Palms-down wrist curl over bench  ⚠ corrupted targetMuscle: NULL
- KN82iganSW8LzDEqf7pe  Palms-Up Dumbbell Wrist Curl Over A Bench  ⚠ corrupted targetMuscle: DUMBBELL
- 4rfaVPzaHC4N3EKEmD5a  Palms-up wrist curl over bench2
- Vpny22re2xbiaMwwiJya  Piriformis SMR
- TFgPzo3xN7YOhBcQQYDH  Power clean
- 6bjweNO3uFf10dVGRGtc  Power Clean from Blocks
- OBKgRngKw5tT6xlj4rA9  Power Partials
- zbKQKOfldDNNtXbkN2ll  Power Snatch
- KSziWkgJxpZSV3I3VQxt  Pull Through
- ghyLreUNtWunQoCWZJ5j  Reverse Hyperextension
- TVymT8EdsGQDjdMIrnwa  Rickshaw Carry  ⚠ corrupted targetMuscle: NULL
- CSf3qZ5IPaqsqi5QKFXD  Romanian Deadlift
- gXfoAFnzULvhK8vvQp4u  Romanian Deadlift from Deficit
- 5fxEsLbhvHDzti3Fd4nK  Romanian Deadlift With Dumbbells
- BthVmuMa1Io0OBV5Pk3K  Seated barbell shoulder press
- 2bKPrMbdChjkXB0CpfN5  Seated Calf Raise
- 6mXpmpD1HNbe5FCYYnlZ  Seated Dumbbell Press
- CCq2i88BtCwr68ISvCfv  Seated dumbbell shoulder press
- 4HnBvfzoAeTqFez2LJ1c  Seated finger curl2
- PCiedb70BEP4Xgrl1olF  Seated Glute Stretch
- Pl5t0GGTpVaRj1B3F09a  Seated Leg Curl
- mdsWzjVsZvYZo34zrztM  Seated One-Arm Dumbbell Palms-Up Wrist Curl  ⚠ corrupted targetMuscle: DUMBBELL
- G5MR5evMNcyNf3SkkoO0  Seated Palms-Down Barbell Wrist Curl  ⚠ corrupted targetMuscle: NULL
- poVeHq7iDhTMHNYxkC52  Seated Palms-Down Barbell Wrist Curl  ⚠ corrupted targetMuscle: NULL
- QFTVGNCeNeCSfal6potn  Seated palms-up wrist curl  ⚠ corrupted targetMuscle: BARBELL
- AFGAuuTBoPvWwpO5ZmWO  Seated Two-Arm Palms-Up Low-Pulley Wrist Curl  ⚠ corrupted targetMuscle: CABLE
- j56nr5vv5zr4KxgMnL0F  Single-arm kettlebell clean
- yTaOWOTVx4OSVIaxZwQF  Single-arm kettlebell swing
- a9CxwlEcMbPW0i0xEafu  Single-arm lateral raise
- 7v9RHY3wXkQcSLYiDsCR  Single-arm palm-in dumbbell shoulder press
- rKzGeH39INBTQXdbzYze  Single-leg cable hip extension
- 4WYdDy46jT8BHB0MCq1Z  Single-leg glute bridge
- vjgsxh7ckNxEfwiEC0AK  Single-leg kettlebell deadlift
- MlZo3alZVVYJXSlDR1EP  Sled push-
- kS5vd7LPqqaAN2EDlt3X  Smith Machine Calf Raise
- A2yabSHH6rqCEcnz4sAx  Smith machine stiff-legged deadlift
- dUCtgmgbXzy4U1W8wErm  Snatch Deadlift
- f4CzFGQUVIEF0Svwyo0J  Standing behind-the-back wrist curl  ⚠ corrupted targetMuscle: BARBELL
- 2UpdKyGQbfN3l5lcCmKJ  Standing dumbbell shoulder press
- jFPlSgPBUKMtCFZBbQ9G  Standing Hamstring and Calf Stretch
- gnpYUuTR6rKw2hApmznZ  Standing hip extension
- dqMvxAp2yRlP8RSKo3sE  Standing Leg Curl
- AQlnEA2UnMZoh5MLUxaC  Standing leg swing
- NUNNACPmlPAM2mjtLQig  Standing palms-in shoulder press
- TU9QblKa9W9Q5ZMnYuvy  Standing Toe Touches
- JTHcvVuKZVMKqsxPFzJQ  Step-up with knee raise
- 4RgqVlL0QhuggdFWpjJJ  Stiff-Legged Dumbbell Deadlift
- Dl3Jg0JW0socitu8oe1W  Straight-bar wrist roll-up  ⚠ corrupted targetMuscle: NULL
- 5jZnOfkgNs1VAQ9tNhGk  Sumo deadlift
- NibNwrQMyONc4DKjijnj  Suspended Hip Thrust
- eKlkZYOAOMcaj4uZ4ulQ  T-Bar Row with Handle
- StZabgMXbA8S2vmeHId9  The Straddle
- O1ekT2E8OXUVsk4YaB6c  Upper Back-Leg Grab
- kohngeqyrsFeNzgGmlCX  Upper Back-Leg Grab
- jwGJNzo67aeBA3kb4Sa6  Vertical Swing
- wRVM1Mc3i27RRIacLH7F  Wide Stance Stiff Legs
- CBipYFaUm1g83WXWDFye  World's greatest stretch
- 4V3jV0Q575CtQFLlIOHn  Wrist Roller2

## New exercises to add

On top of the 158 entries above, add missing popular main lifts, powerlifts, Olympic lifts, and functional/conditioning movements not already covered by name in the lists above — for example (not exhaustive; use your own judgment on what a general fitness-tracking app's library should cover): Overhead Press, Front Squat, Push Press, Snatch, Bench Press (barbell, flat), Incline Bench Press, Bent-Over Row, Pull-Up, Chin-Up, Wall Ball Shot, Battle Ropes Wave, Rowing Machine (Erg), Sandbag Carry, Sled Pull, Turkish Get-Up, Thruster. Give each a `null` `id`.

## How to run this

- **Via the API** (recommended): use `exercise-regeneration.schema.json` as `response_format: { type: "json_schema", json_schema: <contents of that file> }` with `strict: true` — a single call can handle the full batch (158 regenerated + ~15-20 new) since strict structured outputs guarantees schema conformance.
- **Via the ChatGPT web UI** (no schema enforcement): quality and JSON well-formedness degrade over very long outputs. Batch it — e.g. by first letter of name (A-F, G-M, N-S, T-Z) or in chunks of ~25-30 documents per turn — repeating this entire prompt with only the relevant slice of "Existing exercises to regenerate" each time, then do "New exercises to add" as its own final turn. Concatenate the `exercises` arrays from each turn's output into one file afterward.
