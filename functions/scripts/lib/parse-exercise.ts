import jsdom from 'jsdom';
import request from 'request';
import * as admin from 'firebase-admin';

const { JSDOM } = jsdom;

const [URL] = process.argv.slice(2);

request(URL, (error, response, body) => {
  if (error) {
    console.error(error);
    return;
  }

  const dom = new JSDOM(body);
  const document = dom.window.document;

  const instructions = extractInstructions(document);
  const name = extractName(document);
  const { targetMuscle, exerciseType, equipment } = extractExerciseInfo(
    document,
  ) as any;

  const exercise = {
    baseData: {
      targetMuscle,
      exerciseType,
      equipment,
      userId: null,
      admin: true,
      name,
      instructions: instructions.filter(Boolean),
    },
  };

  console.log(exercise);

  const prodApp = admin.initializeApp(
    {
      credential: admin.credential.cert('./sa.prod.json'),
    },
    'prod',
  );

  const db = admin.firestore(prodApp);

  db.collection('exercises')
    .doc()
    .set(exercise)
    .then(console.log)
    .catch(console.error);

  // const stagingApp = admin.initializeApp(
  //   {
  //     credential: admin.credential.cert('./sa.json'),
  //   },
  //   'staging',
  // );

  // const db2 = admin.firestore(stagingApp);

  // db2
  //   .collection('exercises')
  //   .doc()
  //   .set(exercise)
  //   .then(console.log)
  //   .catch(console.error);
});

function extractInstructions(document: Document) {
  // Get the element with the 'itemprop' attribute set to 'description'
  const descriptionElement = document.querySelector(
    '[itemprop="description"]',
  )!;

  // Get all the list items (li) within the ordered list (ol) inside the description element
  const listItems = descriptionElement.querySelectorAll('ol li');

  // Initialize an empty array to store the instructions
  const instructions = [...listItems].map((item) => item.textContent?.trim());

  return instructions;
}

function extractName(document: Document) {
  // Get the element with the 'itemprop' attribute set to 'name'
  const nameElement = document.querySelector('.ExHeading');

  // Extract the text content of the name element and trim any leading/trailing whitespace
  const name = nameElement?.textContent?.trim();

  return name;
}

function extractExerciseInfo(document: Document) {
  // Select the list items within the ul element
  const listItems = document.querySelectorAll('.bb-list--plain li');

  const extractInfoStrategiesMap = {
    Type: (text: string) => ({
      exerciseType: EXERCISE_DESCRIPTORS.exerciseTypes.find(
        (el) =>
          el ===
            EXERCISE_TYPE_MAP[
              text.replace('Type:', '').trim().toUpperCase().replace(' ', '_')
            ] ?? DEFAULT_DESCRIPTOR,
      ),
    }),
    'Main Muscle': (text: string) => ({
      targetMuscle:
        EXERCISE_DESCRIPTORS.muscles.find(
          (el) =>
            el ===
            text
              .replace('Main Muscle Worked:', '')
              .trim()
              .toUpperCase()
              .replace(' ', '_'),
        ) ?? DEFAULT_DESCRIPTOR,
    }),
    Equipment: (text: string) => ({
      equipment:
        EXERCISE_DESCRIPTORS.equipment.find(
          (el) =>
            el ===
            text
              .replace('Equipment:', '')
              .trim()
              .toUpperCase()
              .replace(' ', '_'),
        ) ?? DEFAULT_EQUIPMENT,
    }),
  };

  const getStrategy = (text: string) => {
    const key = Object.keys(extractInfoStrategiesMap).find((key) =>
      text.startsWith(key),
    )!;

    return (
      extractInfoStrategiesMap[key as keyof typeof extractInfoStrategiesMap] ??
      (() => ({}))
    );
  };

  // Combine the extracted information into a single object
  const exerciseInfo = [...listItems].reduce((acc, item) => {
    const text = item.textContent?.trim();

    const strategy = getStrategy(text!);

    return {
      ...acc,
      ...strategy(text!),
    };
  }, {} as Partial<Record<'targetMuscle' | 'exerciseType' | 'equipment', string>>);

  const normalized = {
    equipment: exerciseInfo.equipment ?? DEFAULT_EQUIPMENT,
    targetMuscle: exerciseInfo.targetMuscle ?? DEFAULT_DESCRIPTOR,
    exerciseType: exerciseInfo.exerciseType ?? DEFAULT_DESCRIPTOR,
  };

  return normalized;
}

export const EXERCISE_DESCRIPTORS = {
  muscles: [
    'NECK',
    'TRAPS',
    'SHOULDERS',
    'CHEST',
    'BICEPS',
    'FOREARM',
    'ABDOMINAL',
    'QUADRICEPS',
    'CALVES',
    'TRICEPS',
    'LATS',
    'MIDDLE_BACK',
    'LOWE_BACK',
    'GLUTES',
    'HAMSTRINGS',
    'NULL',
  ],
  equipment: [
    'BANDS',
    'ROLL',
    'BARBELL',
    'KETTLEBELLS',
    'BODY_ONLY',
    'MACHINE',
    'CABLE',
    'MEDICINE_BALL',
    'DUMBBELL',
    'E-Z_BAR',
    'OTHER',
    'EXERCISE_BALL',
    'NONE',
  ],
  exerciseTypes: [
    'CARDIO',
    'WEIGHTLIFTING',
    'PLYOMETRICS',
    'POWERLIFTING',
    'STRENGTH',
    'STRETCHING',
    'STRONGMAN',
    'NULL',
  ],
  proficiencyLvls: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'NULL'],
};

const EXERCISE_TYPE_MAP = {
  OLYMPIC_WEIGHTLIFTING: 'WEIGHTLIFTING',
  PLYOMETRICS: 'PLYOMETRICS',
  POWERLIFTING: 'POWERLIFTING',
  STRENGTH: 'STRENGTH',
  STRETCHING: 'STRETCHING',
  STRONGMAN: 'STRONGMAN',
  CARDIO: 'CARDIO',
  NULL: 'NULL',
} as any;

const DEFAULT_DESCRIPTOR = 'NULL';
const DEFAULT_EQUIPMENT = EXERCISE_DESCRIPTORS.equipment.at(-1);
