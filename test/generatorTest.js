var assert = require('assert');
var should = require('should');
var G = require('../lib/generator');

describe('generator', function () {

  describe('pickRandomSentence', function () {
    it('given dictionary should pick random sentence', function () {
      var dict = {
        sentences: ['<1>.', '<2>!', '<3>?']
      };
      var pickedSentence = G.pickRandomSentence(dict);
      dict.sentences.should.containEql(pickedSentence);
    });
  });

  describe('pickRandomWordByLength', function () {
    it('given dictionary and length should pick random word of given length', function () {
      var dict = {
        words: {
          'w1': ['a', 'b', 'c'],
          'w2': ['aa', 'bb', 'cc'],
          'w3': ['aaa', 'bbb', 'ccc']
        }
      };

      var pickedWord1 = G.pickRandomWordByLength(1, dict);
      dict.words.w1.should.containEql(pickedWord1);

      var pickedWord2 = G.pickRandomWordByLength(2, dict);
      dict.words.w2.should.containEql(pickedWord2);

      var pickedWordBad = G.pickRandomWordByLength(3, dict);
      dict.words.w2.should.not.containEql(pickedWordBad);

      var pickedWord5 = G.pickRandomWordByLength(5, dict);
      assert.equal('', pickedWord5);
    });
  });

  describe('buildSentence', function(){
    it('given simple dictionary should build sentence', function(){
      var dict = {
        words: {
          'w1': ['a'],
          'w2': ['bb'],
          'w3': ['ccc']
        },
        sentences: ['<1>, <2>–<3>?']
      };

      var sentence = G.buildSentence(dict);
      assert.equal('a, bb–ccc?', sentence);
    });
    it('given more complex dictionary should build sentence', function(){
      var dict = {
        words: {
          'w1': ['a', 'b'],
          'w2': ['aa', 'bb'],
          'w3': ['aaa', 'bbb']
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
      var sentence = G.buildSentence(dict);
      possibleSentences.should.containEql(sentence);
    });
  });

});