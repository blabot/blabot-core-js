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

export function buildSentence(dictionary) {
  const regexpRule = /<(\d+)>/g;
  const randomSentence = pickRandomSentence(dictionary);
  const randomWord = R.compose(
    pickRandomWordOfLength(dictionary),
    R.nthArg(1)
  );
  return R.replace(regexpRule, randomWord, randomSentence);
}