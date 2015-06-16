// Declarations ======================
var cache = [
  false, // 0 = Cache flag
  [],    // 1 = Sentences
  []     // 2 = Words
];
var random = Math.random;

// Utils ======================

function pickRandom(array) {
  return array[~~(random() * array.length)]
}

function getRandomInt(min, max) {
  return ~~((random() * (max - min + 1)) + min);
}

function UCFirst(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function unique(arr) {
  if (typeof Set !== 'undefined') {
    var out = [],
      seen = new Set,
      i = arr.length;

    while (i--) {
      if (!seen.has(arr[i])) {
        out[out.length] = arr[i];
        seen.add(arr[i]);
      }
    }
    return out;
  } else {
    var n = {}, r = [];
    for (var i = 0; i < arr.length; ++i) {
      if (!n[arr[i]]) {
        n[arr[i]] = true;
        r.push(arr[i]);
      }
    }
    return r;
  }
}

// Cache ======================

export function enableCache(dictionary, size) {
  if (typeof size === 'undefined')
    size = 7;
  validateDictionary(dictionary);
  cache[0] = false;
  var sLen = dictionary['sentences'].length;
  cache[1] = unique(getSentences(dictionary, sLen * size));
  var wLen = Object.keys(dictionary['words']).length;
  cache[2] = unique(getWords(dictionary, wLen * size));
  cache[0] = true;
  return true;
}

export function disableCache() {
  cache[0] = false;
  cache[1] = [];
  cache[2] = [];
  return true;
}

export function getCache() {
  return cache;
}

// Generator ==================

export function validateDictionary(dictionary) {
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
}

// faster than RegExp replace
export function mixItUpWordsInSentence(sentence, words) {
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

function _getSentenceFromCache() {
  return pickRandom(cache[1]);
}

function _getSentence(dictionary) {
  if (cache[0] === true)
    return _getSentenceFromCache();
  return UCFirst(
    mixItUpWordsInSentence(
      pickRandom(dictionary.sentences),
      dictionary.words));
}

export function getSentence(dictionary) {
  validateDictionary(dictionary);
  return _getSentence(dictionary)
}

export function getSentences(dictionary, count) {
  if (typeof count === 'undefined')
    count = 1;
  validateDictionary(dictionary);
  var items = new Array(count);
  for (var i = 0; i < count; ++i)
    items[i] = _getSentence(dictionary);
  return items;
}

export function getParagraph(dictionary) {
  validateDictionary(dictionary);
  var paragraph = '';
  var sCount = getRandomInt(5, 10);
  for (var j = 0; j < sCount; ++j) {
    paragraph += ' ' + _getSentence(dictionary);
  }
  return paragraph.trim();
}

export function getParagraphs(dictionary, count) {
  if (typeof count === 'undefined')
    count = 1;
  validateDictionary(dictionary);
  var items = new Array(count);
  for (var i = 0; i < count; ++i) {
    items[i] = getParagraph(dictionary);
  }
  return items
}

function _getWordFromCache() {
  return pickRandom(cache[2]);
}

function _getWord(dictionary) {
  if (cache[0] === true)
    return _getWordFromCache();
  return pickRandom(
    dictionary.words[
      pickRandom(
        Object.keys(dictionary.words))]);
}

export function getWord(dictionary) {
  validateDictionary(dictionary);
  return _getWord(dictionary);
}

export function getWords(dictionary, count) {
  validateDictionary(dictionary);
  var items = new Array(count);
  for (var i = 0; i < count; ++i)
    items[i] = _getWord(dictionary);
  return items;
}