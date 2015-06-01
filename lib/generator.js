var R = require('ramda');

function randomFrom(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function pickRandomSentence(dictionary) {
  return randomFrom(R.prop('sentences', dictionary))
}

function pickRandomWordByLength(length, dictionary) {
  var words = R.prop('words', dictionary);
  var wordsOfLength = R.propOr([''], 'w' + length, words);
  return randomFrom(wordsOfLength)
}

function buildSentence(dictionary) {
  return pickRandomSentence(dictionary).replace(/<(\d)>/g, function () {
    return pickRandomWordByLength(arguments[1], dictionary)
  });
}

module.exports.pickRandomSentence = pickRandomSentence;
module.exports.pickRandomWordByLength = pickRandomWordByLength;
module.exports.buildSentence = buildSentence;

