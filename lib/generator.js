import * as R from 'ramda'

var pickRandom = function (array) {
  return array[Math.floor(Math.random() * array.length)]
};

export function pickRandomSentence(dictionary) {
  const sentences = R.prop('sentences', dictionary);
  return pickRandom(sentences)
}

export var pickRandomWordOfLength = R.curry(
  function (dictionary, length) {
    const words = R.prop('words', dictionary);
    const propOrArrayFlipped = R.flip(R.propOr(['']));
    return pickRandom(propOrArrayFlipped(words, length));
  }
);

export var pickRandomWordLength = function (dictionary) {
  return pickRandom(
    Object.keys(
      R.propOr([], 'words', dictionary)));
};

var UCFirst = function (s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export function getSentence(dictionary) {
  const regexpRule = /<(\d+)>/g;
  const randomSentence = pickRandomSentence(dictionary);
  const randomWord = R.compose(
    pickRandomWordOfLength(dictionary),
    R.nthArg(1)
  );
  return UCFirst(R.replace(regexpRule, randomWord, randomSentence));
}

var getMultiple = R.curry(
  function (callback, dictionary, count = 1) {
    var items = [];
    for (; count > 0; count--)
      items.push(callback(dictionary));
    return items
  }
);

export var getSentences = getMultiple(getSentence);

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getParagraph(dictionary) {
  return getSentences(dictionary, getRandomInt(5, 10)).join(' ');
}

export var getParagraphs = getMultiple(getParagraph);

export function getWord(dictionary) {
  return pickRandomWordOfLength(dictionary, pickRandomWordLength(dictionary));
}

export var getWords = getMultiple(getWord);