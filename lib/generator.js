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

var UCFirst = function (s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
};

export function makeSentence(dictionary) {
  const regexpRule = /<(\d+)>/g;
  const randomSentence = pickRandomSentence(dictionary);
  const randomWord = R.compose(
    pickRandomWordOfLength(dictionary),
    R.nthArg(1)
  );
  return UCFirst(R.replace(regexpRule, randomWord, randomSentence));
}

export function makeSentences(dictionary, count=1) {
  var sentences = [];
  for(;count>0;count--){
    sentences.push(makeSentence(dictionary));
  }
  return sentences;
}

export function makeParagraph(dictionary, count) {
  return makeSentences(dictionary, count).join(' ');
}