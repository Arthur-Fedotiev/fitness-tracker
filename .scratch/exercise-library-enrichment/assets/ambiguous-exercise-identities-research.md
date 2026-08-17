Label: wayfinder:research

# Verifying ambiguous exercise identities — research notes

Backs [issue 06: Verify ambiguous exercise identities before trusting the generated batch](../issues/06-verify-ambiguous-exercise-identities.md).

## Source identification

This app's exercise library traces back to **free-exercise-db** (public-domain-image scrape of bodybuilding.com's exercise database; canonical mirror: [`yuhonas/free-exercise-db`](https://github.com/yuhonas/free-exercise-db), `dist/exercises.json`, 873 entries, MIT/public-domain licensed). Confirmed by exact, verbatim name+punctuation matches for **8 of the 9** names in question, including distinctive hyphenation like "Upper Back-Leg Grab" and "The Straddle":

| App name | Exact match in free-exercise-db? |
|---|---|
| Moving Claw Series | yes |
| Power Partials | yes |
| Vertical Swing | yes |
| Upper Back-Leg Grab | yes |
| Downward Facing Balance | yes |
| The Straddle | yes |
| Kneeling Squat | yes |
| Kneeling Jump Squat | yes |
| Suspended Hip Thrust | no |
| Backlash with Dumbbells | no |

`wger.de`'s API (`exercise-translation` name filter) returned zero results for all of these names — ruled out as the source. A second, larger dataset ([`hasaneyldrm/exercises-dataset`](https://github.com/hasaneyldrm/exercises-dataset), 1,324 exercises, ExerciseDB/RapidAPI style, lowercase names like "3/4 sit-up") also had zero matches and uses an entirely different naming convention — not the source either.

**Corroborating signal**: this app's own pre-regeneration Firestore data (saved as [`prod-exercise-inventory-2026-08-16.json`](prod-exercise-inventory-2026-08-16.json) / [`staging-exercise-inventory-2026-08-16.json`](staging-exercise-inventory-2026-08-16.json)) still has the *original* `exerciseType`/`equipment` values for these documents (only `targetMuscle` was flagged as corrupted in [issue 02](../issues/02-finalize-taxonomy.md), for 14/158 docs). For every one of the 9 ids, the original `exerciseType`/`equipment` fields agree with the free-exercise-db record where a match exists — strong independent confirmation that this really is the source dataset, and that the original data (muscle field aside) is trustworthy corroborating evidence, not noise.

For the 2 names absent from free-exercise-db (**Backlash with Dumbbells**, **Suspended Hip Thrust**), the live bodybuilding.com site no longer hosts an exercise database at all (`bodybuilding.com/exercises/*` now 301-redirects to `shop.bodybuilding.com`, itself 404). This is consistent with these two names having existed only in bodybuilding.com's original, larger exercise database (well over 1,300 exercises historically) — free-exercise-db deliberately kept only the subset with permissively-licensed images, so entries with copyrighted photos were dropped from the public mirror. The Wayback Machine's CDX index confirms `bodybuilding.com/exercises/suspended-hip-thrust` was a real, indexed page (10 snapshots, 2019–2022) — but archive.org was in an extended outage ("Internet Archive: Temporarily Offline") for the full duration of this research session, so the archived page content itself could not be read to confirm details directly from that source.

---

## 1. Backlash with Dumbbells

**Could not identify with confidence.** No hit in free-exercise-db, the wger API, the ExerciseDB/hasaneyldrm mirror, JEFIT, WorkoutLabs, myworkouts.io, or general web search for "Backlash with Dumbbells" / "Backlash" as a gym-exercise term in any bodybuilding glossary (Muscle & Strength's bodybuilding glossary, Under Armour's gym-terms glossary, and others were checked — none list "backlash" as an exercise or movement term). The Wayback CDX index has no captures for `bodybuilding.com/exercises/backlash-with-dumbbells` either — confirmed once archive.org's outage cleared enough for the CDX API to return a clean, successful empty result (`[]`), as opposed to the 503s it was returning for everything else during this session. So unlike Suspended Hip Thrust (which does have 10 confirmed snapshots), there's no evidence this page ever existed on bodybuilding.com at all.

Notably, the app's own pre-regeneration data for this document id (`UNpo9QQILw9SQOsWteZW`, present in **both** staging and prod inventories) records `exerciseType: STRENGTH`, `targetMuscle: QUADRICEPS`, `equipment: DUMBBELL` — a leg exercise, not the shoulder/back rear-delt movement currently guessed. `QUADRICEPS` isn't one of the equipment-name-as-muscle corruptions flagged in issue 02, so it isn't obviously bogus data, but a single un-sourced legacy field isn't enough on its own to identify a specific movement (a "quad-targeting dumbbell exercise" could be almost anything — lunges, step-ups, goblet squats, etc.).

**Recommendation**: flag this one back to a human rather than trust either guess. The current rear-delt-raise guess (SHOULDERS/MIDDLE_BACK/TRAPS) has no supporting source and actively conflicts with the app's own prior QUADRICEPS data point. Confidence: **low** — do not persist either version without further input (e.g. asking whoever originally entered this exercise, or treating it as unidentifiable and retiring the name).

Sources checked (no match found): [free-exercise-db](https://github.com/yuhonas/free-exercise-db), [wger.de API](https://wger.de/api/v2/), [hasaneyldrm/exercises-dataset](https://github.com/hasaneyldrm/exercises-dataset), [Muscle & Strength bodybuilding glossary](https://www.muscleandstrength.com/articles/bodybuilding-glossary.html), general web search.

---

## 2. Moving Claw Series

**Real movement**: a sprint-mechanics drill (the "claw" or "clawing" running drill used in track & field / sprint coaching), not a bear-crawl. Performed while running/jogging forward: the athlete flexes the knee to kick the glutes as the hip extends, then aggressively "claws" the foot down and back into the ground directly under the center of mass (like a horse pawing the ground) to build reactive ground-contact power, while pumping the arms in a rapid punching motion.

Source ([free-exercise-db: `Moving_Claw_Series`](https://github.com/yuhonas/free-exercise-db)):
> "This move helps prepare your running form to help you excel at sprinting. As you run, be sure to flex the knee, aiming to kick your glutes as the hip extends. Reload the quad as the leg moves back forward, attacking the ground on the next step. Ensure that as you run, you block with the arms, punching through in a rapid 1-2 motion."
> `category: plyometrics`, `equipment: null`, `primaryMuscles: [hamstrings]`, `secondaryMuscles: [calves, quadriceps]`

Corroborated independently: general sprint-mechanics literature describes the same "claw" foot-strike technique under names like "claw drill" / "cyclic drill" ([Track & Field News](https://trackandfieldnews.com/track-coach/the-art-of-sprint-drills-for-improving-sprint-mechanics/), [Marathon Handbook track drills](https://marathonhandbook.com/track-drills/)) — "the harder the athlete paws against the ground the harder the ground pushes back."

- **exerciseType**: `PLYOMETRICS` (source-confirmed; current guess used `FUNCTIONAL` — `PLYOMETRICS` is the better fit for a reactive, ground-contact sprint drill, though `FUNCTIONAL` is a defensible taxonomy alternative if the app prefers to file movement-quality drills there)
- **targetMuscles**: `HAMSTRINGS`, `CALVES`, `QUADRICEPS` (current guess of FOREARM/ABDOMINAL/SHOULDERS is wrong — those don't fit a running drill at all)
- **equipment**: `BODY_ONLY` (matches the app's own pre-regeneration value for this id)
- **Modern display name**: "Sprint Claw Drill"
- **Confidence**: high

---

## 3. Power Partials

**Real movement**: a standing dumbbell lateral (side) raise performed through a shortened/partial range of motion — typically pausing and only partially lowering near the top of the rep — to keep constant tension on the side deltoids. Not squat-rack partial-range squat/deadlift work.

Source ([free-exercise-db: `Power_Partials`](https://github.com/yuhonas/free-exercise-db)):
> "Stand up with your torso upright and a dumbbell on each hand... Keeping your arms straight and the torso stationary, lift the weights out to your sides until they are about shoulder level height while exhaling. Feel the contraction for a second and begin to lower the weights back down..."
> `category: strength`, `mechanic: isolation`, `force: push`, `equipment: dumbbell`, `primaryMuscles: [shoulders]`

Corroborated by multiple independent secondary sources using the exact same name for the same movement: [WorkoutLabs — "Lateral / Side Shoulder Dumbbell Raises / Power Partials"](https://workoutlabs.com/exercise-guide/dumbbell-lateral-shoulder-raises-power-partials/), [drfitology.com — "Power Partials" filed under Shoulders](https://www.drfitology.com/exercises/shoulders/power-partials), [Muscle & Strength — "Lateral Raise Partials"](https://www.muscleandstrength.com/exercises/lateral-raise-partials), [Gymaholic — "Lateral Raise Partial"](https://www.gymaholic.co/exercises/707/lateral-raise-partial).

- **exerciseType**: `STRENGTH`
- **targetMuscles**: `SHOULDERS`
- **equipment**: `DUMBBELL` (also matches the app's own pre-regeneration value for both ids — `SHOULDERS`/`DUMBBELL`, not `QUADRICEPS`/`BARBELL`)
- **Modern display name**: "Dumbbell Lateral Raise (Partial Reps)"
- **Confidence**: high

Applies to both duplicate ids: `0wdI8mA5fp4cO56AXIVe` and `OBKgRngKw5tT6xlj4rA9`.

---

## 4. Vertical Swing

**Real movement**: an explosive dumbbell swing — a single dumbbell held with both hands, hip-hinge-driven, swung back between the legs and then explosively up to roughly chest/overhead height (analogous to a kettlebell swing, but with a dumbbell and a more vertical/upward finish). Not a two-hand overhead kettlebell swing.

Source ([free-exercise-db: `Vertical_Swing`](https://github.com/yuhonas/free-exercise-db)):
> "Allow the dumbbell to hang at arms length between your legs... Swing the dumbbell between your legs, flexing at the hips... Powerfully reverse the motion by extending at the hips, knees, and ankles to propel yourself upward, swinging the dumbbell over your head..."
> `category: plyometrics`, `mechanic: compound`, `force: pull`, `equipment: dumbbell`, `primaryMuscles: [hamstrings]`, `secondaryMuscles: [glutes, quadriceps, shoulders]`

Corroborated by independent "Dumbbell Swing" guides describing the identical hip-hinge, posterior-chain-driven movement: [liftmanual.com](https://liftmanual.com/dumbbell-swing/), [ritfitsports.com](https://www.ritfitsports.com/blogs/article/how-to-perform-a-dumbbell-swing), [gym-mikolo.com](https://gym-mikolo.com/blogs/home-gym/dumbbell-swings-a-complete-guide-to-mastering-this-underrated-power-move).

- **exerciseType**: `PLYOMETRICS` (source-confirmed; current guess used `FUNCTIONAL` — `PLYOMETRICS` fits better given the ballistic, explosive nature and matches the source category)
- **targetMuscles**: `HAMSTRINGS`, `GLUTES`, `SHOULDERS`
- **equipment**: `DUMBBELL` — **correction**: not `KETTLEBELLS` as currently guessed; also matches the app's own pre-regeneration value for this id
- **Modern display name**: "Dumbbell Swing"
- **Confidence**: high

---

## 5. Upper Back-Leg Grab

**Real movement**: a *seated*, two-legged forward-fold hamstring stretch — sit with legs extended together, hug both thighs from underneath with your arms, and pull your chest down toward your knees; optionally lean/pull your back away from your knees while still hugging them for an added middle-back stretch. This is not a standing one-leg-balance quad stretch reaching back to grab your foot — that's a different, unrelated stretch (a standing quad stretch).

Source ([free-exercise-db: `Upper_Back-Leg_Grab`](https://github.com/yuhonas/free-exercise-db)):
> "While seated, bend forward to hug your thighs from underneath with both arms. Keep your knees together and your legs extended out as you bring your chest down to your knees. You can also stretch your middle back by pulling your back away from your knees as your hugging them."
> `category: stretching`, `force: static`, `equipment: null`, `primaryMuscles: [hamstrings]`, `secondaryMuscles: [lower back, middle back]`

This is a direct, exact-name primary-source match (name, category, and equipment all align with the app's own pre-regeneration data too — `STRETCHING`/`NONE` for both ids).

- **exerciseType**: `STRETCHING` (matches current guess)
- **targetMuscles**: `HAMSTRINGS`, `LOWER_BACK`, `MIDDLE_BACK` — **correction**: hamstrings is the actual primary muscle and was missing entirely from the current guess (`MIDDLE_BACK`/`SHOULDERS`/`QUADRICEPS`); quadriceps/shoulders don't belong here at all
- **equipment**: `NONE` — matches the app's own pre-regeneration value (current guess used `BODY_ONLY`)
- **Modern display name**: "Seated Hamstring and Upper Back Stretch"
- **Confidence**: high

Applies to both duplicate ids: `O1ekT2E8OXUVsk4YaB6c` and `kohngeqyrsFeNzgGmlCX`.

---

## 6. Downward Facing Balance

**Real movement**: a stability/exercise-ball supported prone hold — lie face-down on an exercise ball, walk your hands forward along the floor while the ball rolls under your torso/hips, and extend your legs straight out behind you (a ball-supported plank/extension hold). This requires an actual stability ball; it is not a bird-dog/superman hold on all fours on the floor.

Source ([free-exercise-db: `Downward_Facing_Balance`](https://github.com/yuhonas/free-exercise-db)):
> "Lie facedown on top of an exercise ball. While resting on your stomach on the ball, walk your hands forward along the floor and lift your legs, extending your elbows and knees."
> `category: strength`, `mechanic: isolation`, `force: static`, `equipment: exercise ball`, `primaryMuscles: [glutes]`, `secondaryMuscles: [abdominals, hamstrings]`

This exact match, including the equipment field, agrees with the app's own pre-regeneration data for this id, which already recorded `equipment: EXERCISE_BALL` (not `BODY_ONLY`) before the corrupted-field cleanup.

- **exerciseType**: `STRENGTH` (source-confirmed and matches the app's prior data; current guess used `FUNCTIONAL` — `STRENGTH` is the better-supported call, though `FUNCTIONAL` remains a defensible taxonomy alternative given the stability/core-control emphasis)
- **targetMuscles**: `GLUTES`, `ABDOMINAL`, `HAMSTRINGS`
- **equipment**: `EXERCISE_BALL` — **correction**: not `BODY_ONLY`; this changes what the exercise actually requires
- **Modern display name**: "Stability Ball Plank Hold"
- **Confidence**: high

---

## 7. Suspended Hip Thrust

**Real movement, resolved to the TRX/suspension-strap interpretation, not the two-bench version.** No exact-name entry exists in free-exercise-db, so this is inferred from convention + corroborating evidence rather than a literal source read:

1. **Naming-convention evidence**: every "Suspended X" exercise that *does* exist in free-exercise-db — `Suspended Fallout`, `Suspended Push-Up`, `Suspended Reverse Crunch`, `Suspended Row`, `Suspended Split Squat` — uses `equipment: other` (i.e. this app's `OTHER`), consistently meaning gymnastic rings / suspension straps (TRX-style), never a bench. There is no comparable "feet-elevated-between-two-benches" naming pattern anywhere in the dataset.
2. **The app's own pre-regeneration data** for this exact document id (`NibNwrQMyONc4DKjijnj`, both envs) already recorded `equipment: OTHER`, `exerciseType: STRENGTH`, `targetMuscle: GLUTES` — consistent with the suspension-strap reading (a two-bench setup would more plausibly have been tagged `NONE`/`BODY_ONLY`/`BOX`).
3. **Page existence**: the Wayback Machine's CDX index confirms `bodybuilding.com/exercises/suspended-hip-thrust` was a real, indexed page with 10 snapshots between 2019 and 2022 — archive.org was down for the duration of this research session so the page content itself couldn't be read directly, but its existence under this exact name/slug on bodybuilding.com is confirmed.
4. **Modern equivalent**: "TRX Hip Thrust" / "TRX Hip Press" is a well-documented current exercise — lying supine, heels secured in TRX foot cradles, driving the hips up into a bridge/thrust — matching the currently-guessed instructions almost verbatim ([fitbod.me — TRX Hip Thrust](https://fitbod.me/exercises/trx-hip-thrust), [Motra — Suspension Trainer Hip Thrust](https://www.motra.com/exercises/trxHipThrust)).

- **exerciseType**: `STRENGTH`
- **targetMuscles**: `GLUTES`, `HAMSTRINGS`
- **equipment**: `OTHER`
- **Modern display name**: "TRX Hip Thrust"
- **Confidence**: medium-high (strong convergent circumstantial evidence — naming convention, the app's own prior data, and a matching modern exercise — but not a literal primary-source page read, since archive.org was unreachable throughout this session)

---

## 8. The Straddle

**Real movement**: matches the current guess closely — a seated, wide-legged ("straddle"/V-shape) forward fold, hinging forward from the hips with hands reaching toward the floor, held for 10–20 seconds.

Source ([free-exercise-db: `The_Straddle`](https://github.com/yuhonas/free-exercise-db)):
> "Begin in a seated, upright position. Start by extending your legs in front of you in a V. With your hands on the floor, lean forward as far as possible. Hold for 10 to 20 seconds."
> `category: stretching`, `force: static`, `equipment: null`, `primaryMuscles: [hamstrings]`, `secondaryMuscles: [adductors, calves]`

Corroborated broadly by yoga/stretching literature on the "seated straddle" / "wide-legged seated forward fold" / *Upavistha Konasana*, all describing the same hamstrings + adductors (+ calves) stretch.

- **exerciseType**: `STRETCHING` (matches current guess)
- **targetMuscles**: `HAMSTRINGS`, `ADDUCTORS`, `CALVES` — minor addition: source lists calves as a secondary muscle, missing from the current guess's `ADDUCTORS`/`HAMSTRINGS`-only list
- **equipment**: `BODY_ONLY` (matches the app's own pre-regeneration value; source lists no equipment)
- **Modern display name**: "Seated Straddle Stretch" (current name "The Straddle Stretch" is already close; this just tightens it)
- **Confidence**: high

---

## 9. Kneeling Squat

**Real movement, and confirmed distinct from "Kneeling Jump Squat"**: a barbell exercise performed inside a power rack — kneel behind the bar (with knee padding), slide under it and rack it across the back of the shoulders exactly as in a standard back squat, then sit back until your glutes touch your calves, and reverse the motion back to upright. There is no jump, no bodyweight-only version emphasized, and no plyometric component — it's a strength/powerlifting accessory movement specifically used (per Bret Contreras's EMG research, cited by a secondary source below) because kneeling removes ankle/knee-dominance and balance contributions, isolating glute drive.

Source ([free-exercise-db: `Kneeling_Squat`](https://github.com/yuhonas/free-exercise-db)):
> "Set the bar to the proper height in a power rack. Kneel behind the bar... Slide under the bar, racking it across the back of your shoulders... Unrack the weight. With your head looking forward, sit back with your butt until you touch your calves. Reverse the motion, returning the torso to an upright position."
> `category: powerlifting`, `mechanic: compound`, `force: push`, `equipment: barbell`, `primaryMuscles: [glutes]`, `secondaryMuscles: [abdominals, hamstrings, lower back]`

Independently corroborated by [WorkoutLabs — "Barbell Kneeling Squats"](https://workoutlabs.com/exercise-guide/barbell-kneeling-squats/), [weighttraining.guide — "Barbell kneeling squat"](https://weighttraining.guide/exercises/barbell-kneeling-squat/), and a summary citing Bret Contreras's glute-activation EMG testing ([dumbbellsdirect.com](https://dumbbellsdirect.com/blogs/barbell-exercisesspecific-movements/kneeling-squat)) — all describing the identical barbell-in-power-rack, kneel-and-sit-back movement.

This is also fully corroborated by the app's own **pre-regeneration** data for this exact document id (`LWPRjxvQXTwsYFvth7J1`, prod), which already recorded `exerciseType: POWERLIFTING`, `equipment: BARBELL`, `targetMuscle: GLUTES` — before the accidental copy-paste from "Kneeling Jump Squat" overwrote it with plyometric bodyweight content in the current draft. Four independent sources (free-exercise-db, two secondary exercise sites, and the app's own prior un-corrupted record) all agree.

- **exerciseType**: `POWERLIFTING`
- **targetMuscles**: `GLUTES`, `HAMSTRINGS`, `LOWER_BACK`
- **equipment**: `BARBELL`
- **Modern display name**: "Barbell Kneeling Squat" (also clearly distinguishes it from "Kneeling Jump Squat")
- **Confidence**: very high
