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

  describe('pickRandomWordOfLength', function () {
    it('given dictionary and length should pick random word of given length', function () {
      var dict = {
        words: {
          '1': ['a', 'b', 'c'],
          '2': ['aa', 'bb', 'cc'],
          '3': ['aaa', 'bbb', 'ccc']
        }
      };

      var prwl = G.pickRandomWordOfLength(dict);
      dict.words[1].should.containEql(prwl(1));
      dict.words[2].should.containEql(prwl(2));
      dict.words[2].should.not.containEql(prwl(3));
      assert.equal('', prwl(5));
    });
  });

  describe('buildSentence', function(){
    it('given simple dictionary should build sentence', function(){
      var dict = {
        words: {
          '1': ['a'],
          '2': ['bb'],
          '3': ['ccc']
        },
        sentences: ['<1>, <2>–<3>?']
      };

      var sentence = G.buildSentence(dict);
      assert.equal('a, bb–ccc?', sentence);
    });
    it('given more complex dictionary should build sentence', function(){
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
      var sentence = G.buildSentence(dict);
      possibleSentences.should.containEql(sentence);
    });
  });

});