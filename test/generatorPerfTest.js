var G = require('../lib/generator');

var count = 10e4;
var dict = {
  words: {
    '1': ['a', 'b'],
    '2': ['aa', 'bb'],
    '3': ['aaaa', 'bbb'],
    '4': ['aaaa', 'bbbb'],
    '5': ['ááááá', 'ččččč'],
    '6': ['žžžžžž', 'šššššš'],
    '7': ['řřřřřřř', 'ěěěěěěě', 'aaaaaaa', 'fffffff', 'rrrrrrr', 'lllllll']
  },
  sentences: [
    '<1> – <2> <6>+ <7>, <4> <3> <3>, <1> – <5> <7>!',
    '<1> – <2>!',
    '<3>, <3>.',
    '<2>, <3>!',
    '<5>, <6>.',
    '<7>, <2>?',
    '<7>, <7>…'
  ]
};
describe('Generator Performance', function () {

    it('should getSentence fast', function () {
      for (var i = 0; i < count; i++)
        G.sentence(dict);
    });

    it('should getSentences fast', function () {
      G.sentences(dict, count);
    });

    it('should getParagraph fast', function () {
      for (var i = 0; i < count; i++)
        G.paragraph(dict);
    });

    it('should getParagraphs fast', function () {
      G.paragraphs(dict, count);
    });

    it('should getWord fast', function () {
      for (var i = 0; i < count; i++)
        G.word(dict);
    });

    it('should getWords fast', function () {
      G.words(dict, count);
    });

});