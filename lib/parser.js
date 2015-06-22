'use strict';

var RE_WORD = '[A-Za-zÁÉÍÔÚÜ-Ýáěéíóôúü-ýĀ-ž0-9]'; //cz/sk \w definition

function stringToRegexp(string, options) {
  var re = /.^/;
  if (typeof options == 'undefined' && typeof string == 'undefined')
    return re;
  if (typeof options == 'undefined')
    options = '';
  if (typeof string == 'undefined')
    string = '.^';

  try {
    return new RegExp(string, options);
  } catch (e) {
    return re;
  }
}

function replaceByRegexp(reString, replaceBy, inText) {
  var re = stringToRegexp(reString, 'gmi');
  return inText.replace(re, replaceBy);
}

function normalizeByRegexps(rules, text) {
  if (rules == [])
    return text;
  rules.map(function () {
    var reStr = arguments[0][0];
    var newStr = arguments[0][1];
    text = replaceByRegexp(reStr, newStr, text);
  });
  return text;
}

function stripBadWords(words, text) {
  if (words == [])
    return text;
  words.map(function () {
    var badWord = arguments[0];
    //var reStr = ' \w*' + badWord + '\w*';
    var reStr = ' ' + RE_WORD + '*' + badWord + RE_WORD + '*';
    text = replaceByRegexp(reStr, '', text);
  });
  return text;
}

function extractWords(dictionary, specialChars, text) {

  if (typeof dictionary['words'] === 'undefined')
    dictionary['words'] = {};
  if (typeof specialChars === 'undefined')
    specialChars = '';

  //var reStr = '\w+[' + specialChars + ']\w+|\w+';
  var reStr = RE_WORD + '+[' + specialChars + ']' + RE_WORD + '+|' + RE_WORD + '+';
  var re = stringToRegexp(reStr, 'gm');

  text = text.replace(re, function () {
    var word = arguments[0].toLowerCase(),
      wLen = word.length,
      words = dictionary.words[wLen] || [];
    if (words.indexOf(word) == -1)
      dictionary.words[wLen] = words.concat([word]);
    return '<' + wLen + '>';
  });
  return text;
}

function extractSentences(dictionary, delimiters, text) {
  if (dictionary['sentences'] === 'undefined')
    dictionary['sentences'] = [];
  if (typeof delimiters === 'undefined')
    delimiters = '';

  var reStr = '[^' + delimiters + ']+[' + delimiters + ']',
    re = stringToRegexp(reStr, 'gm');

  text.replace(re, function () {
    var sentence = arguments[0].trim(),
      sentences = dictionary.sentences || [];
    if (sentences.indexOf(sentence) == -1)
      dictionary.sentences = sentences.concat([sentence]);
  });
  return true;
}

function parse(dictionary, text) {

  if (typeof dictionary !== 'object')
    throw new Error('Dictionary must be object');
  if (dictionary['sentences'] === 'undefined')
    dictionary['sentences'] = [];
  if (typeof dictionary['words'] === 'undefined')
    dictionary['words'] = {};
  if (typeof text === 'undefined' || text === '')
    return false;

  var config = dictionary.config || {};

  if (typeof config.normalizingRules !== 'undefined')
    text = normalizeByRegexps(config.normalizingRules, text);
  if (typeof config.badWords !== 'undefined')
    text = stripBadWords(config.badWords, text);

  text = extractWords(dictionary, config.specialWordChars || '', text);
  return extractSentences(dictionary, config.sentenceDelimiters || '', text);
}

exports.stringToRegexp = stringToRegexp;
exports.replaceByRegexp = replaceByRegexp;
exports.normalizeByRegexps = normalizeByRegexps;
exports.stripBadWords = stripBadWords;
exports.extractWords = extractWords;
exports.extractSentences = extractSentences;
exports.parse = parse;