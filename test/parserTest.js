var assert = require('assert');
var should = require('should');
var P = require('../lib/parser');

describe('Parser', function () {

  describe('stringToRegexp', function () {
    context('given nothing', function () {
      it('should return empty regex', function () {
        var expect = new RegExp('.^', '');
        var actual = P.stringToRegexp();
        actual.should.be.type('object');
        actual.toString().should.eql(expect.toString());
      });
    });
    context('given invalid regex', function () {
      it('should return empty regex', function () {
        var expect = new RegExp('.^');
        var actual = P.stringToRegexp('[∂fafafa');
        actual.should.be.type('object');
        actual.toString().should.eql(expect.toString());
      });
    });
  });

  describe('replaceByRegex', function () {
    it('should skip on invalid regex', function () {
      var text = 'some text some text';
      assert.equal(text, P.replaceByRegexp('[sdfsd', '–', text));
    });
    it('should strip by regex', function () {
      var text = 'some text some text';
      var expect = 'some–text–some–text';
      assert.equal(P.replaceByRegexp(' ', '–', text), expect);
      var expect1 = 'some–text–some–text';
      assert.equal(P.replaceByRegexp(' ', '–', text), expect1);
    });
  });

  describe('normalizeByRegexps', function () {
    it('should normalize text by given RegExp ruleset', function () {
      var text = "Příliš \nžluťoučký  \tkůň , pěl \rpříšerné ódy...";
      var rules = [
        ['\\.\\.\\.', '.'],
        [' , ', ', '],
        ['\\s+', ' ']
      ];
      var expect = "Příliš žluťoučký kůň, pěl příšerné ódy.";
      assert.equal(P.normalizeByRegexps(rules, text), expect)
    });
  });

  describe('stripBadWords', function () {
    it('should remove words by given array', function () {
      var text = "Toto je KURVÁ vlastně doprdelé slušný text pÍČo!";
      var badWords = ["kurv", "píč", "prdel"];
      var expect = "Toto je vlastně slušný text!";
      assert.equal(P.stripBadWords(badWords, text), expect)
    });
  });

  describe('extractWords', function () {

    context('given word', function () {
      it('should return dictionary with word', function () {
        var dictionary= {};
        var expectName = 'words';
        var expectValue = {'8': ['slovíčko']};
        P.extractWords(dictionary, '', 'slovíčko');
        dictionary.should.have.property(expectName, expectValue);
      });
    });

    context('given two same words', function () {
      it('should return dictionary with word', function () {
        var dictionary= {};
        var expectName = 'words';
        var expectValue = {'8': ['slovíčko']};
        P.extractWords(dictionary, '', 'slovíčko slovíčko');
        dictionary.should.have.property(expectName, expectValue);
      });
    });

    context('given different words', function () {
      it('should return dictionary with lower case words', function () {
        var dictionary = {};
        var expectName = 'words';
        var expectValue = {
          '1': ['á'],
          '2': ['bb'],
          '3': ['ččč'],
          '4': ['ďďďď'],
          '5': ['ěéěéě']
        };
        P.extractWords(dictionary, '', 'Á bb, ččč ďďďď - ĚéĚÉě!');
        dictionary.should.have.property(expectName, expectValue);
      });
    });

    context('given different words with special chars', function () {
      it('should return dictionary with words', function () {
        var expectName = 'words';
        var expectValue = {
          '1': ['á'],
          '2': ['bb'],
          '3': ['č’č'],
          '4': ['ďď—ď'],
          '5': ['ěé.éě']
        };
        var dictionary = {};
        var text = 'Á bb, č’č ďď—ď - ěé.Éě!';
        var specialChars = '’—.';
        P.extractWords(dictionary, specialChars, text);
        dictionary.should.have.property(expectName, expectValue);
      });
    });

    context('given text', function(){
      it('should retun word-less text', function(){
        var text = "Á bb, ččč ďďďď - ěéĚÉě!";
        var expect = "<1> <2>, <3> <4> - <5>!";
        var actual = P.extractWords({}, '', text);
        actual.should.equal(expect);
      });
    });
  });

  describe('extractSentences', function(){
    context('given text and delimiters', function(){
      it('should extract sentences by delimiters', function(){
        var dictionary = {};
        var text = "Věta prvá?  Za ní, druhá! Třetí - pěkně vedle ní. ";
        var delimiters = '!.?';
        var expectName = 'sentences';
        var expectValue = [
          "Věta prvá?",
          "Za ní, druhá!",
          "Třetí - pěkně vedle ní."
        ];
        P.extractSentences(dictionary, delimiters, text);
        dictionary.should.have.property(expectName, expectValue);
      });
    });
  });
  
  describe('parse', function(){
    context('given complex text and empty dictionary', function(){
      it('should build full new dictionary', function(){

        var config = {
          'normalizingRules': [
            ['\\.\\.\\.', '.'],
            ['\\s+', ' '],
            [' , ', ', ']
          ],
          'badWords': ["kur","píč", "čurá", "mrd", "srá"],
          'specialWordChars': "'—.",
          'sentenceDelimiters': "!.?…"
        };
        var dictionary = {
          'config': config
        };
        var text = " Á\tbb čurák ,\n č'č?    Ďď—ď -   KURVA ěéĚÉě! FfFf'f 1234.67. ";
        var expect = {
          'config': config,
          'words': {
            '1': ['á'],
            '2': ['bb'],
            '3': ["č'č"],
            '4': ['ďď—ď'],
            '5': ['ěéěéě'],
            '6': ["ffff'f"],
            '7': ['1234.67']
          },
          'sentences': [
            "<1> <2>, <3>?",
            "<4> - <5>!",
            "<6> <7>."
          ]
        };

        P.parse(dictionary, text);
        dictionary.should.have.property('words', expect.words);
        dictionary.should.have.property('sentences', expect.sentences);
      });
    });

    context('given complex text and non empty dictionary', function(){
      it('should add content to dictionary', function(){

        var config = {
          'normalizingRules': [
            ['\\.\\.\\.', '.'],
            ['\\s+', ' '],
            [' , ', ', ']
          ],
          'badWords': ["kur","píč", "čurá", "mrd", "srá"],
          'specialWordChars': "'—.",
          'sentenceDelimiters': "!.?…"
        };
        var dictionary = {
          'config': config,
          'words': {
            '1': ['á'],
            '2': ['bb'],
            '3': ["č'č"],
            '4': ['ďď—ď'],
            '5': ['ěéěéě'],
            '6': ["ffff'f"],
            '7': ['1234.67']
          },
          'sentences': [
            "<1> <2>, <3>?",
            "<4> - <5>!",
            "<6> <7>."
          ]
        };

        var text = "Apaců'ka – fúndé.můka! Fundé—káve  , kávecuka…";
        var expect = {
          'config': config,
          'words': {
            '1': ['á'],
            '2': ['bb'],
            '3': ["č'č"],
            '4': ['ďď—ď'],
            '5': ['ěéěéě'],
            '6': ["ffff'f"],
            '7': ['1234.67'],
            '8': ["apaců'ka", "kávecuka"],
            '10': ["fúndé.můka", "fundé—káve"]
          },
          'sentences': [
            "<1> <2>, <3>?",
            "<4> - <5>!",
            "<6> <7>.",
            "<8> – <10>!",
            "<10>, <8>…"
          ]
        };

        P.parse(dictionary, text);
        dictionary.should.have.property('words', expect.words);
        dictionary.should.have.property('sentences', expect.sentences);
      });
    });
  });
});