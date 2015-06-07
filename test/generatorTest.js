var assert = require('assert');
var should = require('should');
var G = require('../lib/generator');

describe('Generator', function () {
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

  describe('getSentence', function(){
    it('given simple dictionary should build sentence', function(){
      var dict = {
        words: {
          '1': ['a'],
          '2': ['bb'],
          '3': ['ccc']
        },
        sentences: ['<1>, <2>–<3>?']
      };

      var sentence = G.getSentence(dict);
      assert.equal('A, bb–ccc?', sentence);
    });
    it('given more complex dictionary should build sentence', function(){
      var dict = {
        words: {
          '1': ['a', 'b'],
          '2': ['aa', 'bb'],
          '3': ['aaa', 'bbb'],
          '111': ['stojedenáct', 'takystojedenáct']
        },
        sentences: [
          '<1> – <2>!',
          '<3>, <3>?',
          '<111>, <111>…'
        ]
      };

      var possibleSentences = [
        'Stojedenáct, takystojedenáct…',
        'Takystojedenáct, stojedenáct…',
        'Stojedenáct, stojedenáct…',
        'Takystojedenáct, takystojedenáct…',
        'Aaa, aaa?',
        'Bbb, bbb?',
        'Aaa, bbb?',
        'Bbb, aaa?',
        'A – aa!',
        'A – bb!',
        'B – aa!',
        'B – bb!'
      ];

      for(var i=12; i>0; i--){
        var sentence = G.getSentence(dict);
        possibleSentences.should.containEql(sentence);
      }
    });
  });

  describe('getSentences', function(){
    context('given complex dictionary', function(){
      var dict = {
        words: {
          '1': ['a', 'b'],
          '2': ['aa', 'bb'],
          '3': ['aaa', 'bbb'],
          '111': ['stojedenáct', 'takystojedenáct']
        },
        sentences: [
          '<1> – <2>!',
          '<3>, <3>?',
          '<111>, <111>…'
        ]
      };

      var possibleSentences = [
        'Stojedenáct, takystojedenáct…',
        'Takystojedenáct, stojedenáct…',
        'Stojedenáct, stojedenáct…',
        'Takystojedenáct, takystojedenáct…',
        'Aaa, aaa?',
        'Bbb, bbb?',
        'Aaa, bbb?',
        'Bbb, aaa?',
        'A – aa!',
        'A – bb!',
        'B – aa!',
        'B – bb!'
      ];

      it('should build one sentence as default', function(){
        var sentences = G.getSentences(dict);
        assert.equal(sentences.length, 1);
        var s = 'some sentence';
        sentences.forEach(function(sentence){
          possibleSentences.should.containEql(sentence);
          s.should.not.eql(sentence);
          s = sentence;
        });
      });

      it('should build sentence by count', function(){
        var count = 42;
        var sentences = G.getSentences(dict, count);
        assert.equal(sentences.length, count);
        sentences.forEach(function(sentence){
          possibleSentences.should.containEql(sentence);
        });
      });
    });
  });

  describe('pickRandomWordLength', function(){
    it('should pick valid word length', function(){
      var dict = {
        words: {
          '1': ['a', 'b'],
          '2': ['aa', 'bb'],
          '3': ['aaa', 'bbb'],
          '111': ['stojedenáct', 'takystojedenáct']
        }
      };
      for (var i=42; i>0;i--){
        var actual = G.pickRandomWordLength(dict);
        dict.words.should.hasOwnProperty(actual);
      }
    });
  });

  describe('getWord', function(){
    var dict = {
      words: {
        '1': ['a', 'b'],
        '2': ['aa', 'bb'],
        '3': ['aaaa', 'bbb'],
        '4': ['aaaa', 'bbbb'],
        '5': ['ááááá', 'ččččč'],
        '6': ['žžžžžž', 'šššššš'],
        '7': ['řřřřřřř', 'ěěěěěěě']
      },
      sentences: [
        '<1> – <2>!',
        '<3>, <3>?',
        '<111>, <111>…'
      ]
    };
    it('should return random word from dictionary', function(){
      for (var i=42; i>0;i--){
        var actual = G.getWord(dict);
        dict.words[actual.length].should.containEql(actual);
      }
    });
  });

});