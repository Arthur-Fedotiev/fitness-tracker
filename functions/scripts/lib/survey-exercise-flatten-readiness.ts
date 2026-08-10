import * as admin from 'firebase-admin';
import { COLLECTIONS } from 'shared-package';

// Read-only survey. Does not write, update, or delete anything.
const certPath = process.argv[2] ?? './sa.json';

admin.initializeApp({
  credential: admin.credential.cert(certPath),
});

const db = admin.firestore();

const EXPECTED_BASE_DATA_FIELDS = [
  'name',
  'exerciseType',
  'targetMuscle',
  'equipment',
  'instructions',
  'userId',
  'admin',
] as const;

interface SerializedWorkoutItemLike {
  id: string;
  children?: SerializedWorkoutItemLike[] | null;
}

/**
 * Only leaf items (children == null) carry a real exercise doc ID. Composite
 * ("Superset") container nodes synthesize their id as `name + '/' + _id` —
 * see WorkoutItemComposite.id in workout.ts — so they're never a real
 * exercise reference and must be excluded here.
 */
function collectContentIds(items: SerializedWorkoutItemLike[] | undefined): string[] {
  if (!items) return [];
  return items.flatMap((item) =>
    item.children ? collectContentIds(item.children) : [item.id],
  );
}

/**
 * Read-only readiness check ahead of unwrapping `exercises/{id}.baseData` into
 * flat top-level fields (in-place transform, same doc IDs).
 *
 * Confirms two things per environment before the migration script is written:
 * 1. Every exercise doc's `baseData` has exactly the 7 expected fields, so an
 *    in-place `set(ref, baseData)` won't silently drop or misname anything.
 * 2. How many `workouts` docs reference exercise IDs via `content[].id` (incl.
 *    nested `children`), and how many of those IDs are already dangling
 *    (don't resolve to an exercise doc) — a baseline so any dangling refs
 *    found *after* the migration can't be blamed on it.
 *
 * Usage: `node dist/lib/survey-exercise-flatten-readiness.js <path-to-service-account-json>`
 */
async function surveyFlattenReadiness() {
  const exercisesSnapshot = await db.collection(COLLECTIONS.EXERCISES).get();

  let total = 0;
  let adminOwned = 0;
  let userOwned = 0;
  let missingBaseData = 0;
  let unexpectedShape = 0;

  const exerciseIds = new Set<string>();
  const shapeIssues: string[] = [];

  for (const doc of exercisesSnapshot.docs) {
    total++;
    exerciseIds.add(doc.id);
    const data: any = doc.data();
    const baseData = data.baseData;

    if (baseData == null) {
      missingBaseData++;
      shapeIssues.push(`${doc.id} — no baseData field at all`);
      continue;
    }

    if (baseData.admin === true) adminOwned++;
    else if (typeof baseData.userId === 'string') userOwned++;

    const baseDataKeys = Object.keys(baseData).sort();
    const expectedKeys = [...EXPECTED_BASE_DATA_FIELDS].sort();
    const extraKeys = baseDataKeys.filter((k) => !expectedKeys.includes(k as any));
    const missingKeys = expectedKeys.filter((k) => !baseDataKeys.includes(k));

    const topLevelKeys = Object.keys(data).filter((k) => k !== 'baseData');

    if (extraKeys.length || missingKeys.length || topLevelKeys.length) {
      unexpectedShape++;
      shapeIssues.push(
        `${doc.id} — extraBaseDataKeys:[${extraKeys}] missingBaseDataKeys:[${missingKeys}] extraTopLevelKeys:[${topLevelKeys}]`,
      );
    }
  }

  const workoutsSnapshot = await db.collection('workouts').get();

  let workoutsWithContent = 0;
  let referencedIdTotal = 0;
  let danglingRefTotal = 0;
  const danglingRefsByWorkout: string[] = [];

  for (const doc of workoutsSnapshot.docs) {
    const data: any = doc.data();
    const ids = collectContentIds(data.content);
    if (ids.length === 0) continue;

    workoutsWithContent++;
    referencedIdTotal += ids.length;

    const dangling = ids.filter((id) => !exerciseIds.has(id));
    if (dangling.length) {
      danglingRefTotal += dangling.length;
      danglingRefsByWorkout.push(`${doc.id} — dangling:[${dangling}]`);
    }
  }

  console.log('--- Exercise baseData shape issues ---');
  shapeIssues.forEach((line) => console.log(line));

  console.log('\n--- Dangling workout->exercise refs (pre-existing, not caused by this survey) ---');
  danglingRefsByWorkout.forEach((line) => console.log(line));

  console.log('\n--- Survey summary ---');
  console.log(
    JSON.stringify(
      {
        exercises: {
          total,
          adminOwned,
          userOwned,
          missingBaseData,
          unexpectedShape,
        },
        workouts: {
          total: workoutsSnapshot.size,
          workoutsWithContent,
          referencedIdTotal,
          danglingRefTotal,
        },
      },
      null,
      2,
    ),
  );
}

surveyFlattenReadiness()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
