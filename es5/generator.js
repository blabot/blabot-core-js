'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.pickRandomSentence = pickRandomSentence;
exports.getSentence = getSentence;
exports.getParagraph = getParagraph;
exports.getWord = getWord;

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
var pickRandomWordLength = function pickRandomWordLength(dictionary) {
  return pickRandom(Object.keys(R.propOr([], 'words', dictionary)));
};

exports.pickRandomWordLength = pickRandomWordLength;
var UCFirst = function UCFirst(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
};

function getSentence(dictionary) {
  var regexpRule = /<(\d+)>/g;
  var randomSentence = pickRandomSentence(dictionary);
  var randomWord = R.compose(pickRandomWordOfLength(dictionary), R.nthArg(1));
  return UCFirst(R.replace(regexpRule, randomWord, randomSentence));
}

var getMultiple = R.curry(function (callback, dictionary) {
  var count = arguments[2] === undefined ? 1 : arguments[2];

  return R.repeat(callback(dictionary), count);
});

var getSentences = getMultiple(getSentence);

exports.getSentences = getSentences;
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getParagraph(dictionary) {
  return getSentences(dictionary, getRandomInt(5, 10)).join(' ');
}

var getParagraphs = getMultiple(getParagraph);

exports.getParagraphs = getParagraphs;

function getWord(dictionary) {
  return pickRandomWordOfLength(dictionary, pickRandomWordLength);
}

var getWords = getMultiple(getWord);
exports.getWords = getWords;