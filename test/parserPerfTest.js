var should = require('should');
var P = require('../lib/parser');

var count = 10e3;

describe('Parser Performance', function () {
  var text = "Příliš \nžluťoučký  \tkůň , pěl \rpříšerné ódy...";
  var text1 = "Věta prvá?  Za ní, druhá! Třetí - pěkně vedle ní. ";
  var badtext = "Toto je KURVÁ vlastně doprdelé slušný text pÍČo!";
  var longtext = new Array(21).join(text);
  var longtext1 = new Array(21).join(text1);

  it('should convert stringToRegexp fast', function () {
    for (var i = 0; i < count; i++)
      P.stringToRegexp('.*', 'gmi');
  });

  it('should replaceByRegex fast', function () {
    for (var i = 0; i < count; i++)
      P.replaceByRegexp(' ', '–', longtext);
  });

  it('should normalizeByRegexps fast', function () {
    var rules = [
      ['\\.\\.\\.', '.'],
      [' , ', ', '],
      ['\\s+', ' ']
    ];
    for (var i = 0; i < count; i++)
      P.normalizeByRegexps(rules, longtext);
  });

  it('should stripBadWords fast', function () {
    var badWords = ["kurv", "píč", "prdel"];
    for (var i = 0; i < count; i++)
      P.stripBadWords(badWords, badtext);
  });

  it('should extractWords fast', function(){
    for (var i = 0; i < count; i++)
      P.extractWords({}, '', longtext);
  });

  it('should extractSentences fast', function(){
    var dictionary = {},
        delimiters = '!.?…';
    for (var i = 0; i < count; i++)
      P.extractSentences(dictionary, delimiters, longtext1);
  });

  it('should parse fast', function(){
    var text = " Á\tbb čurák ,\n č'č?    Ďď—ď -   KURVA ěéĚÉě! FfFf'f 1234.67. ";
    var dictionary = {
      'config': {
        'normalizingRules': [
          ['\\.\\.\\.', '.'],
          ['\\s+', ' '],
          [' , ', ', ']
        ],
        'badWords': ["kur","píč", "čurá", "mrd", "srá"],
        'specialWordChars': "'—.",
        'sentenceDelimiters': "!.?…"
      }
    };
    for (var i = 0; i < count; i++)
      P.parse(dictionary, text);
  });


});
