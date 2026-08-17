import * as fs from 'fs';
import * as admin from 'firebase-admin';
import { COLLECTIONS } from 'shared-package';

const rawArgs = process.argv.slice(2);
const onlyFlagIndex = rawArgs.indexOf('--only');
const onlyName = onlyFlagIndex !== -1 ? rawArgs[onlyFlagIndex + 1] : undefined;
const positionalArgs = rawArgs.filter(
  (arg, i) => !arg.startsWith('--') && (onlyFlagIndex === -1 || i !== onlyFlagIndex + 1),
);
const certPath = positionalArgs[0] ?? './sa.json';
const outputPath =
  positionalArgs[1] ?? '../../.scratch/exercise-library-enrichment/assets/exercise-regeneration.output.json';
const commit = rawArgs.includes('--commit');

admin.initializeApp({
  credential: admin.credential.cert(certPath),
});

const db = admin.firestore();

/**
 * The one known orphaned user-owned exercise (staging only, confirmed by
 * survey-exercise-flatten-readiness.ts's ADR-0005 run and re-confirmed by the
 * exercise-library-enrichment map's own read-only survey) referenced by zero
 * workouts. Deleted alongside the regeneration since both are part of the
 * same map's decided scope. Guarded by an `admin !== true` check below so
 * this is a no-op against prod, where the doc doesn't exist.
 */
const ORPHANED_USER_OWNED_EXERCISE_ID = 'VBdVhPdQJ7KmUn6RdJLq';

interface RegeneratedExercise {
  id: string | null;
  name: string;
  exerciseType: string;
  targetMuscles: string[];
  equipment: string;
  instructions: string[];
}

/**
 * Persists exercise-regeneration.output.json (see the exercise-library-
 * enrichment map, tickets 03/05/06) to Firestore: overwrites every existing
 * admin-owned `exercises/{id}` doc this environment actually has in place
 * (same doc ID, full `.set()` replace — no dual old/new-shape period),
 * creates a new doc for every `id: null` entry whose `name` doesn't already
 * exist among this environment's admin-owned docs, and deletes the one
 * known orphaned user-owned exercise.
 *
 * An entry whose `id` isn't a document in *this* environment is skipped
 * (the 143 existing ids in the output batch are split across staging/prod,
 * 15 shared) - it applies to the other environment's run instead. The
 * name-based dedup on `id: null` entries makes the script safely
 * re-runnable as new entries are appended to the output batch over time
 * (e.g. filling gaps found after the main batch already ran) without
 * re-creating exercises that were already added on a prior run.
 *
 * Defaults to a dry run that only logs the intended writes. Pass `--commit`
 * to actually write.
 *
 * Pass `--only "<exact name>"` to restrict the batch to a single exercise —
 * for adding one exercise discovered after the main batch already ran,
 * without re-processing (and duplicate-creating) every other `id: null`
 * entry, which by design gets created fresh on every run. Skips the orphan
 * deletion step in that mode, since it's a one-off addition, not a full pass.
 *
 * Usage: `node dist/lib/persist-exercise-regeneration.js <sa-path> [output-json-path] [--commit] [--only "<name>"]`
 * Run against `./sa.json` (staging) first, review the dry run, `--commit`,
 * confirm in the app, then repeat against `./sa.prod.json`.
 */
async function persistExerciseRegeneration() {
  const { exercises: allExercises } = JSON.parse(fs.readFileSync(outputPath, 'utf8')) as {
    exercises: RegeneratedExercise[];
  };
  const exercises = onlyName ? allExercises.filter((e) => e.name === onlyName) : allExercises;

  if (onlyName && exercises.length === 0) {
    throw new Error(`--only "${onlyName}" matched no entries in ${outputPath}`);
  }

  const existingSnapshot = await db.collection(COLLECTIONS.EXERCISES).get();
  const existingIds = new Set(existingSnapshot.docs.map((doc) => doc.id));
  const existingAdminNames = new Set(
    existingSnapshot.docs
      .filter((doc) => doc.data()['admin'] === true)
      .map((doc) => doc.data()['name'] as string),
  );

  let overwritten = 0;
  let skippedNotInThisEnv = 0;
  let skippedAlreadyCreated = 0;
  let created = 0;

  let batch = db.batch();
  let batchSize = 0;

  const flush = async () => {
    if (batchSize === 0) return;
    if (commit) await batch.commit();
    batch = db.batch();
    batchSize = 0;
  };

  const queueWrite = (ref: FirebaseFirestore.DocumentReference, data: object) => {
    batch.set(ref, data);
    batchSize++;
  };

  for (const exercise of exercises) {
    const { id, ...rest } = exercise;
    const flatData = { ...rest, userId: null, admin: true };

    if (id === null) {
      if (existingAdminNames.has(exercise.name)) {
        console.log(`SKIP (already exists) — ${exercise.name}`);
        skippedAlreadyCreated++;
        continue;
      }
      const ref = db.collection(COLLECTIONS.EXERCISES).doc();
      console.log(`${commit ? 'CREATE' : 'DRY-RUN create'} ${ref.id} — ${exercise.name}`);
      queueWrite(ref, flatData);
      created++;
    } else if (existingIds.has(id)) {
      console.log(`${commit ? 'OVERWRITE' : 'DRY-RUN overwrite'} ${id} — ${exercise.name}`);
      queueWrite(db.collection(COLLECTIONS.EXERCISES).doc(id), flatData);
      overwritten++;
    } else {
      skippedNotInThisEnv++;
      continue;
    }

    if (batchSize === 500) {
      await flush();
    }
  }

  await flush();

  let deletedOrphan = false;
  if (!onlyName) {
    const orphanRef = db.collection(COLLECTIONS.EXERCISES).doc(ORPHANED_USER_OWNED_EXERCISE_ID);
    const orphanSnapshot = await orphanRef.get();
    if (orphanSnapshot.exists && orphanSnapshot.data()?.['admin'] !== true) {
      console.log(`${commit ? 'DELETE' : 'DRY-RUN delete'} ${ORPHANED_USER_OWNED_EXERCISE_ID} — orphaned user-owned exercise`);
      if (commit) await orphanRef.delete();
      deletedOrphan = true;
    }
  }

  console.log(
    JSON.stringify(
      {
        mode: commit ? 'COMMITTED' : 'DRY-RUN (pass --commit to write)',
        totalInBatch: exercises.length,
        overwritten,
        created,
        skippedNotInThisEnv,
        skippedAlreadyCreated,
        deletedOrphan,
      },
      null,
      2,
    ),
  );
}

persistExerciseRegeneration()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
