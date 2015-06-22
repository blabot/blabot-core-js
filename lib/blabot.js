'use strict';

var Blabot = function(){

  var G = require('../lib/generator').createGenerator();
  var P = require('../lib/parser').createParser();

  var createBlabot = function(){
    return new Blabot;
  };

  return {
    getWord: G.getWord,
    getWords: G.getWords,
    getSentence: G.getSentence,
    getSentences: G.getSentences,
    getParagraph: G.getParagraph,
    getParagraphs: G.getParagraphs,
    enableCache: G.enableCache,
    disableCache: G.disableCache,
    getCache: G.getCache,
    parse: P.parse,
    createBlabot: createBlabot
  }
};

module.exports = new Blabot;