"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EXERCISE_DESCRIPTORS = void 0;
const jsdom_1 = __importDefault(require("jsdom"));
const request_1 = __importDefault(require("request"));
const admin = __importStar(require("firebase-admin"));
const { JSDOM } = jsdom_1.default;
const [URL, instructionVideo] = process.argv.slice(2);
(0, request_1.default)(URL, (error, response, body) => {
    if (error) {
        console.error(error);
        return;
    }
    const dom = new JSDOM(body);
    const document = dom.window.document;
    const instructions = extractInstructions(document);
    const name = extractName(document);
    const { targetMuscle, exerciseType, equipment } = extractExerciseInfo(document);
    const { avatarUrl, avatarSecondaryUrl } = extractImageUrls(document);
    const exercise = {
        baseData: {
            avatarUrl,
            avatarSecondaryUrl,
            targetMuscle,
            exerciseType,
            equipment,
            instructionVideo: instructionVideo ?? null,
            userId: null,
            admin: true,
        },
        translatableData: {
            name,
            instructions: instructions.filter(Boolean).join('___'),
        },
    };
    console.log(exercise);
    const prodApp = admin.initializeApp({
        credential: admin.credential.cert('./sa.prod.json'),
    }, 'prod');
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
function extractInstructions(document) {
    // Get the element with the 'itemprop' attribute set to 'description'
    const descriptionElement = document.querySelector('[itemprop="description"]');
    // Get all the list items (li) within the ordered list (ol) inside the description element
    const listItems = descriptionElement.querySelectorAll('ol li');
    // Initialize an empty array to store the instructions
    const instructions = [...listItems].map((item) => item.textContent?.trim());
    return instructions;
}
function extractName(document) {
    // Get the element with the 'itemprop' attribute set to 'name'
    const nameElement = document.querySelector('.ExHeading');
    // Extract the text content of the name element and trim any leading/trailing whitespace
    const name = nameElement?.textContent?.trim();
    return name;
}
function extractExerciseInfo(document) {
    // Select the list items within the ul element
    const listItems = document.querySelectorAll('.bb-list--plain li');
    const extractInfoStrategiesMap = {
        Type: (text) => ({
            exerciseType: exports.EXERCISE_DESCRIPTORS.exerciseTypes.find((el) => el ===
                EXERCISE_TYPE_MAP[text.replace('Type:', '').trim().toUpperCase().replace(' ', '_')] ?? DEFAULT_DESCRIPTOR),
        }),
        'Main Muscle': (text) => ({
            targetMuscle: exports.EXERCISE_DESCRIPTORS.muscles.find((el) => el ===
                text
                    .replace('Main Muscle Worked:', '')
                    .trim()
                    .toUpperCase()
                    .replace(' ', '_')) ?? DEFAULT_DESCRIPTOR,
        }),
        Equipment: (text) => ({
            equipment: exports.EXERCISE_DESCRIPTORS.equipment.find((el) => el ===
                text
                    .replace('Equipment:', '')
                    .trim()
                    .toUpperCase()
                    .replace(' ', '_')) ?? DEFAULT_EQUIPMENT,
        }),
    };
    const getStrategy = (text) => {
        const key = Object.keys(extractInfoStrategiesMap).find((key) => text.startsWith(key));
        return (extractInfoStrategiesMap[key] ??
            (() => ({})));
    };
    // Combine the extracted information into a single object
    const exerciseInfo = [...listItems].reduce((acc, item) => {
        const text = item.textContent?.trim();
        const strategy = getStrategy(text);
        return {
            ...acc,
            ...strategy(text),
        };
    }, {});
    const normalized = {
        equipment: exerciseInfo.equipment ?? DEFAULT_EQUIPMENT,
        targetMuscle: exerciseInfo.targetMuscle ?? DEFAULT_DESCRIPTOR,
        exerciseType: exerciseInfo.exerciseType ?? DEFAULT_DESCRIPTOR,
    };
    return normalized;
}
function extractImageUrls(document) {
    // Select all elements with the class "ExDetail-imgWrap"
    const imageWrapElements = document.querySelectorAll('.ExDetail-imgWrap');
    // Extract and map the image URLs using the `map` function
    const imageUrls = Array.from(imageWrapElements).map((imageWrap) => {
        // Find the image element within the container
        const imgElement = imageWrap.querySelector('.ExImg');
        // Extract the image URL from the "data-large-photo" attribute
        return imgElement?.getAttribute('data-large-photo');
    });
    return {
        avatarUrl: imageUrls[0],
        avatarSecondaryUrl: imageUrls[1],
    };
}
function extractVideoSrc(document) {
    // Get the video element by its class name
    const videoElement = document.querySelector('.jw-video');
    // Check if the video element exists
    if (videoElement) {
        // Get the "src" attribute of the video element
        const videoSrc = videoElement.getAttribute('src');
        // Check if the "src" attribute is not null or empty
        if (videoSrc) {
            // Return the video source URL
            return videoSrc;
        }
        else {
            // If "src" attribute is empty, log an error message
            console.error('Video source URL is empty.');
        }
    }
    else {
        // If video element is not found, log an error message
        console.error('Video element not found.');
    }
    // Return null if video source cannot be extracted
    return null;
}
exports.EXERCISE_DESCRIPTORS = {
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
};
const DEFAULT_DESCRIPTOR = 'NULL';
const DEFAULT_EQUIPMENT = exports.EXERCISE_DESCRIPTORS.equipment.at(-1);
