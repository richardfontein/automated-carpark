import axios from 'axios';
import { BadRequestError } from '../status/clientErrorCodes';

const ANYTIME_PLAN = '24/7';

// Ambiguous character map, used to add a combination of registration plates
// to the Smart Parking database to ensure all similar license plate reads are
// allowed entry.
const ambiguousCharacterMap = {
  A: ['4'],
  B: ['8', '3'],
  D: ['Q'],
  G: ['6'],
  H: ['II'],
  I: ['L', '1'],
  L: ['I', '1'],
  O: ['D', 'Q', '0'],
  Q: ['D', 'O', '0'],
  S: ['5'],
  W: ['VV'],
  Z: ['2'],
  0: ['D', 'Q', 'O'],
  1: ['I', 'L'],
  2: ['Z'],
  3: ['8', 'B'],
  4: ['A'],
  5: ['S'],
  6: ['G'],
  8: ['B', '3'],
};

const replaceRecursive = (word, replacedWords, newWord = '') => {
  if (word === '') {
    // Got to end of string, add to list and return
    return replacedWords.push(newWord);
  }

  // Checks substring of word for a match in the ambiguousCharacterMap
  const charMap = ambiguousCharacterMap[word[0]];

  if (charMap) {
    // Character located in ambiguous character map, iterate through the array
    charMap.forEach(ambiguousChar =>
      replaceRecursive(word.slice(1), replacedWords, newWord + ambiguousChar));

    // Create unchanged string too, keep recursing
    replaceRecursive(word.slice(1), replacedWords, newWord + word[0]);
  } else {
    // Character not located in map, continue down string
    replaceRecursive(word.slice(1), replacedWords, newWord + word[0]);
  }

  return 0;
};

const replaceAmbiguousCharacters = (word) => {
  const replacedWords = [];
  replaceRecursive(word, replacedWords);
  return replacedWords;
};

const replaceAmbiguousWords = plates =>
  plates.flatMap(({ registration }) => replaceAmbiguousCharacters(registration));

const username = process.env.SMART_PARKING_USER;
const password = process.env.SMART_PARKING_PASS;
const siteCode = process.env.SMART_PARKING_SITE_CODE;
const nodeEnvironment = process.env.NODE_ENV;

const synchronize = async ({
 id, firstName, lastName, plates = [], 
}, method) => {
  if (nodeEnvironment !== 'production') {
    // Don't send to SmartParking if not in production
    return Promise.resolve();
  }

  // Headers
  const cfg = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      username,
      password,
      siteCode,
    },
  };
  const url = `https://smartrep01.smartparking.com/comms/leasee/${method}`;

  // Map each plate through the ambiguous character map
  // eg. [CAR] => [CAR, C4R]
  // Ensures plates are not misread during plate recognition
  const replacedPlates = replaceAmbiguousWords(plates);

  // Request body
  const body = JSON.stringify(
    method === 'delete'
      ? { id }
      : {
          id,
          firstName,
          lastName,
          plates: replacedPlates,
          plan: ANYTIME_PLAN,
        },
  );

  const uri = `item=${encodeURIComponent(body)}`;

  try {
    const res = await axios.post(url, uri, cfg);
    if (res.data.valid === false) {
      throw new Error(res.data.invalidReason);
    }

    return res.data;
  } catch (e) {
    throw new BadRequestError(e.message);
  }
};

const composeLease = (tenancy, user) => ({
  id: tenancy.id,
  firstName: `${user.firstName} ${user.lastName}`,
  lastName: `${user.company}${user.company && tenancy.nickname ? ' - ' : ''}${tenancy.nickname}`,
  plates: tenancy.plates,
});

export const createLease = async (tenancy, user) => {
  const lease = composeLease(tenancy, user);

  return synchronize(lease, 'create');
};

export const updateLease = async (tenancy, user) => {
  const lease = composeLease(tenancy, user);

  return synchronize(lease, 'update');
};

export const deleteLease = async (tenancy) => {
  try {
    return await synchronize({ id: tenancy.id }, 'delete');
  } catch (e) {
    return Promise.resolve();
    // Ignore deletion errors, lease was already removed
  }
};
