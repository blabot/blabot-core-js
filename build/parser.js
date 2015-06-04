'use strict';

var R = require('ramda');

var RE_WORD = '[A-Za-zÁÉÍÔÚÜ-Ýáéíôúü-ýĀ-ž0-9]'; //cz/sk \w definition

function stringToRegexp(string, options) {
  if (typeof string === 'undefined') {
    string = '.^'; //empty RegExp
  }
  if (typeof options === 'undefined') {
    options = '';
  }

  var regex = new RegExp('.^');
  try {
    regex = new RegExp(string, options);
  } catch (e) {}
  return regex;
}

function replaceByRegexp(reString, replaceBy, inText) {
  var re = stringToRegexp(reString, 'gmi');
  return inText.replace(re, replaceBy);
}

function normalizeByRegexps(rules, text) {
  rules.map(function () {
    var reStr = arguments[0][0];
    var newStr = arguments[0][1];
    text = replaceByRegexp(reStr, newStr, text);
  });
  return text;
}

function stripBadWords(words, text) {
  words.map(function () {
    var badWord = arguments[0];
    var reStr = ' ' + RE_WORD + '*' + badWord + RE_WORD + '*';
    text = replaceByRegexp(reStr, '', text);
  });
  return text;
}

function extractWords(dictionary, specialChars, text) {
  if (typeof dictionary === 'object' && dictionary.hasOwnProperty('words') === false) {
    dictionary['words'] = {};
  }

  if (typeof text === 'undefined' || text === '') {
    return text;
  }

  if (typeof specialChars === 'undefined') {
    specialChars = '';
  }

  // '\w+[specialChars]\w+|\w+/
  var reStr = RE_WORD + '+[' + specialChars + ']' + RE_WORD + '+|' + RE_WORD + '+';

  text = text.replace(stringToRegexp(reStr, 'gm'), function () {
    var word = arguments[0];
    var wordLength = word.length;
    var wIndex = wordLength;

    if (dictionary.words.hasOwnProperty(wIndex) === false) {
      dictionary.words[wIndex] = [];
    }

    var wordLC = word.toLowerCase();
    dictionary.words[wIndex] = R.uniq(R.append(wordLC, dictionary.words[wIndex]));

    return '<' + wordLength + '>';
  });
  return text;
}

function extractSentences(dictionary, delimiters, text) {
  if (typeof dictionary === 'object' && dictionary.hasOwnProperty('sentences') === false) {
    dictionary['sentences'] = [];
  }

  if (typeof text === 'undefined' || text === '' || typeof delimiters === 'undefined') {
    return false;
  }

  var reStr = '[^' + delimiters + ']+[' + delimiters + ']';
  text.replace(stringToRegexp(reStr, 'gm'), function () {
    var sentence = arguments[0].trim();
    dictionary.sentences = R.uniq(R.append(sentence, dictionary.sentences));
  });
  return true;
}

function parse(dictionary, config, text) {
  if (config.hasOwnProperty('normalizingRules') === false) {
    config.normalizingRules = [];
  }

  if (config.hasOwnProperty('badWords') === false) {
    config.badWords = [];
  }

  if (config.hasOwnProperty('specialWordChars') === false) {
    config.specialWordChars = '';
  }

  if (config.hasOwnProperty('sentenceDelimiters') === false) {
    config.sentenceDelimiters = '';
  }

  text = normalizeByRegexps(config.normalizingRules, text);
  text = stripBadWords(config.badWords, text);
  text = extractWords(dictionary, config.specialWordChars, text);
  return extractSentences(dictionary, config.sentenceDelimiters, text);
}

module.exports.stringToRegexp = stringToRegexp;
module.exports.replaceByRegexp = replaceByRegexp;
module.exports.normalizeByRegexps = normalizeByRegexps;
module.exports.stripBadWords = stripBadWords;
module.exports.extractWords = extractWords;
module.exports.extractSentences = extractSentences;
module.exports.parse = parse;

// no exceptions pls