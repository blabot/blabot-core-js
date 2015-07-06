'use strict';

var Generator = function () {

  var random = Math.random;

// Utils ======================

  var _pickRandom = function (array) {
    return array[~~(random() * array.length)]
  };

  var _getRandomInt = function (min, max) {
    return ~~((random() * (max - min + 1)) + min);
  };

  var _UCFirst = function (s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

// Generator ==================

  var _validateDictionary = function (dictionary) {
    if (typeof dictionary['sentences'] === 'undefined' ||
      dictionary['sentences'].length == 0
    ) {
      throw new Error('Dictionary must have some Sentences');
    }

    if (typeof dictionary['words'] === 'undefined' ||
      dictionary['words'].length == 0
    ) {
      throw new Error('Dictionary must have some Words');
    }
  };

  var _mixWordsInSentence = function (sentence, words) {
    var outstr = '',
        start = -1,
        end = 0;
    while ((end = sentence.indexOf('<', ++start)) > -1) {
      outstr += sentence.slice(start, end);
      start = end;
      if ((end = sentence.indexOf('>', start)) > -1) {
        outstr += _pickRandom(words[sentence.slice(start + 1, end)]);
        start = end;
      }
    }
    return outstr + sentence.slice(start);
  };

  var _sentence = function (dictionary) {
    return _UCFirst(
      _mixWordsInSentence(
        _pickRandom(dictionary.sentences),
        dictionary.words));
  };

  var sentence = function (dictionary) {
    _validateDictionary(dictionary);
    return _sentence(dictionary)
  };

  var sentences = function (dictionary, count) {
    if (typeof count === 'undefined')
      count = 1;
    _validateDictionary(dictionary);
    var items = new Array(count);
    for (var i = 0; i < count; ++i)
      items[i] = _sentence(dictionary);
    return items;
  };

  var paragraph = function (dictionary) {
    _validateDictionary(dictionary);
    var paragraph = '';
    var sCount = _getRandomInt(5, 10);
    for (var j = 0; j < sCount; ++j) {
      paragraph += ' ' + _sentence(dictionary);
    }
    return paragraph.trim();
  };

  var paragraphs = function (dictionary, count) {
    if (typeof count === 'undefined')
      count = 1;
    _validateDictionary(dictionary);
    var items = new Array(count);
    for (var i = 0; i < count; ++i) {
      items[i] = paragraph(dictionary);
    }
    return items
  };

  var _word = function (dictionary) {
    return _pickRandom(
      dictionary.words[
        _pickRandom(
          Object.keys(dictionary.words))]);
  };

  var word = function (dictionary) {
    _validateDictionary(dictionary);
    return _word(dictionary);
  };

  var words = function (dictionary, count) {
    if (typeof count === 'undefined')
      count = 1;
    _validateDictionary(dictionary);
    var items = new Array(count);
    for (var i = 0; i < count; ++i)
      items[i] = _word(dictionary);
    return items;
  };

  var createGenerator = function () {
    return new Generator;
  };

  return {
    _pickRandom: _pickRandom,
    _getRandomInt: _getRandomInt,
    _UCFirst: _UCFirst,
    _validateDictionary: _validateDictionary,
    _mixWordsInSentence: _mixWordsInSentence,
    sentence: sentence,
    sentences: sentences,
    paragraph: paragraph,
    paragraphs: paragraphs,
    word: word,
    words: words,
    createGenerator: createGenerator
  }
};

module.exports = new Generator;