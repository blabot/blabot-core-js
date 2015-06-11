'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.validateDictionary = validateDictionary;
exports.mixItUpWordsInSentence = mixItUpWordsInSentence;
exports.getSentence = getSentence;
exports.getSentences = getSentences;
exports.getParagraph = getParagraph;
exports.getParagraphs = getParagraphs;
exports.getWord = getWord;
exports.getWords = getWords;
var random = Math.random;

function pickRandom(array) {
  return array[~ ~(random() * array.length)];
}

function getRandomInt(min, max) {
  return ~ ~(random() * (max - min + 1) + min);
}

function UCFirst(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function validateDictionary(dictionary) {
  if (dictionary.hasOwnProperty('sentences') === false || dictionary.sentences.length == 0) {
    throw new Error('Dictionary must have some Sentences');
  }

  if (dictionary.hasOwnProperty('words') === false || dictionary.words.length == 0) {
    throw new Error('Dictionary must have some Words');
  }
}

// faster than RegExp replace

function mixItUpWordsInSentence(sentence, words) {
  var outstr = '',
      start = -1,
      end = 0;
  while ((end = sentence.indexOf('<', ++start)) > -1) {
    outstr += sentence.slice(start, end);
    start = end;
    if ((end = sentence.indexOf('>', start)) > -1) {
      outstr += pickRandom(words[sentence.slice(start + 1, end)]);
      start = end;
    }
  }
  return outstr + sentence.slice(start);
}

function getSentence(dictionary) {
  validateDictionary(dictionary);
  return UCFirst(mixItUpWordsInSentence(pickRandom(dictionary.sentences), dictionary.words));
}

function getSentences(dictionary, count) {
  if (typeof count === 'undefined') count = 1;
  validateDictionary(dictionary);
  var items = new Array(count);
  for (var i = 0; i < count; ++i) {
    items[i] = UCFirst(mixItUpWordsInSentence(pickRandom(dictionary.sentences), dictionary.words));
  }
  return items;
}

function getParagraph(dictionary) {
  return getSentences(dictionary, getRandomInt(5, 10)).join(' ');
}

function getParagraphs(dictionary, count) {
  validateDictionary(dictionary);
  var items = new Array(count);
  for (var i = 0; i < count; ++i) {
    var paragraph = '';
    var sCount = getRandomInt(5, 10);
    for (var j = 0; j < sCount; ++j) {
      paragraph += UCFirst(mixItUpWordsInSentence(pickRandom(dictionary.sentences), dictionary.words));
    }
    items[i] = paragraph;
  }
  return items;
}

function getWord(dictionary) {
  return pickRandom(dictionary.words[pickRandom(Object.keys(dictionary.words))]);
}

function getWords(dictionary, count) {
  validateDictionary(dictionary);
  var items = new Array(count);
  for (var i = 0; i < count; ++i) {
    items[i] = pickRandom(dictionary.words[pickRandom(Object.keys(dictionary.words))]);
  }
  return items;
}