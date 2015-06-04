'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.pickRandomSentence = pickRandomSentence;
exports.buildSentence = buildSentence;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

var _ramda = require('ramda');

var R = _interopRequireWildcard(_ramda);

var pickRandom = function pickRandom(array) {
  return array[Math.floor(Math.random() * array.length)];
};

function pickRandomSentence(dictionary) {
  var sentences = R.prop('sentences', dictionary);
  return pickRandom(sentences);
}

var pickRandomWordOfLength = R.curry(function (dictionary, length) {
  var words = R.prop('words', dictionary);
  var propOrArrayFlipped = R.flip(R.propOr(['']));
  return pickRandom(propOrArrayFlipped(words, length));
});

exports.pickRandomWordOfLength = pickRandomWordOfLength;

function buildSentence(dictionary) {
  var regexpRule = /<(\d)>/g;
  var randomSentence = pickRandomSentence(dictionary);
  var randomWord = R.compose(pickRandomWordOfLength(dictionary), R.nthArg(1));
  return R.replace(regexpRule, randomWord, randomSentence);
}