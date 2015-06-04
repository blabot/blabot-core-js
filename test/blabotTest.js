var assert = require('assert');
var should = require('should');
var B = require('../build/blabot');

describe('Blabot API', function(){
  describe('buildSentence', function(){
    it('given dictionary should build sentence', function(){
      var dict = {
        words: {
          '1': ['a', 'b'],
          '2': ['aa', 'bb'],
          '3': ['aaa', 'bbb']
        },
        sentences: [
          '<1> – <2>!',
          '<3>, <3>?'
        ]
      };

      var possibleSentences = [
        'aaa, aaa?',
        'bbb, bbb?',
        'aaa, bbb?',
        'bbb, aaa?',
        'a – aa!',
        'a – bb!',
        'b – aa!',
        'b – bb!'
      ];
      var sentence = B.buildSentence(dict);
      possibleSentences.should.containEql(sentence);
    });
  });

  describe('parse', function(){
    context('given complex text and empty dictionary', function(){
      it('should build full new dictionary', function(){
        var dictionary = {};
        var text = " Á\tbb čurák ,\n č'č?    Ďď—ď -   KURVA ěéĚÉě! FfFf'f 1234.67. ";
        var expect = {
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

        B.parse(dictionary, config, text);
        dictionary.should.have.property('words', expect.words);
        dictionary.should.have.property('sentences', expect.sentences);
      });
    });

    context('given complex text and non empty dictionary', function(){
      it('should add content to dictionary', function(){

        var dictionary = {
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

        var text = "Apaců'ka – fúndé.můka! Fundé—káve  , kávecuka…";
        var expect = {
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

        B.parse(dictionary, config, text);
        dictionary.should.have.property('words', expect.words);
        dictionary.should.have.property('sentences', expect.sentences);
      });
    });
  });
});