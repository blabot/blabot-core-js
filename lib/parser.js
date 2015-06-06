import * as R from 'ramda';

var RE_WORD = '[A-Za-zÁÉÍÔÚÜ-Ýáéíôúü-ýĀ-ž0-9]'; //cz/sk \w definition

export var stringToRegexp = R.curry(
  function stringToRegexp(string = '.^', options = '') {
    var regex;
    try {
      regex = new RegExp(string, options);
    } catch (e) {
      regex = new RegExp('.^');
    }
    return regex;
  }
);

export var replaceByRegexp = R.curry(
  function (reString, replaceBy, inText) {
    var re = stringToRegexp(reString, 'gmi');
    return inText.replace(re, replaceBy);
  }
);

export var normalizeByRegexps = R.curry(
  function (rules, text) {
    rules.map(function () {
      var reStr = arguments[0][0];
      var newStr = arguments[0][1];
      text = replaceByRegexp(reStr, newStr, text);
    });
    return text;
  }
);

export var stripBadWords = R.curry(
  function (words, text) {
    words.map(function () {
      var badWord = arguments[0];
      //var reStr = ' \w*' + badWord + '\w*';
      var reStr = ' ' + RE_WORD + '*' + badWord + RE_WORD + '*';
      text = replaceByRegexp(reStr, '', text);
    });
    return text;
  }
);

export var extractWords = R.curry(
  function (dictionary, specialChars, text) {

    if (typeof dictionary !== 'object')
      throw new Error('Dictionary must be object');

    if (dictionary.hasOwnProperty('words') === false)
      dictionary['words'] = {};

    if (typeof specialChars === 'undefined')
      specialChars = '';

    if (typeof text === 'undefined' || text === '')
      return text;

    //var reStr = '\w+[' + specialChars + ']\w+|\w+';
    var reStr = RE_WORD + '+[' + specialChars + ']' + RE_WORD + '+|' + RE_WORD + '+';

    text = text.replace(stringToRegexp(reStr, 'gm'), function () {
      var word = arguments[0];
      var wIndex = word.length;

      if (dictionary.words.hasOwnProperty(wIndex) === false) {
        dictionary.words[wIndex] = [];
      }

      var wordLC = word.toLowerCase();

      dictionary.words[wIndex] = R.uniq(
        R.append(wordLC, dictionary.words[wIndex])
      );

      return '<' + wIndex + '>';
    });
    return text;
  }
);

export var extractSentences = R.curry(
  function (dictionary, delimiters, text) {
    if (typeof dictionary !== 'object')
      throw new Error('Dictionary must be object');

    if (dictionary.hasOwnProperty('sentences') === false)
      dictionary['sentences'] = [];

    if (typeof delimiters === 'undefined')
      delimiters = '';

    if (typeof text === 'undefined' || text === '')
      return false;

    var reStr = '[^' + delimiters + ']+[' + delimiters + ']';
    text.replace(stringToRegexp(reStr, 'gm'), function () {
      var sentence = arguments[0].trim();
      dictionary.sentences = R.uniq(R.append(sentence, dictionary.sentences));
    });
    return true;
  }
);

var configPropOr = R.curry(
  function (dictionary, cProp) {
    return R.propOr({}, cProp,
      R.propOr({}, 'config', dictionary));
  }
);

export var parse = R.curry(
  function parse(dictionary, text) {
    var config = configPropOr(dictionary);
    return R.pipe(
      normalizeByRegexps(config('normalizingRules')),
      stripBadWords(config('badWords')),
      extractWords(dictionary, config('specialWordChars')),
      extractSentences(dictionary, config('sentenceDelimiters'))
    )(text);
  }
);