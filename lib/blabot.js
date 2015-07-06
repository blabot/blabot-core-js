'use strict';

var Blabot = function(){

  var _G = require('../lib/generator').createGenerator();
  var _P = require('../lib/parser').createParser();

  var _dictionary = {};

  var createBlabot = function(d){
    var B = new Blabot;
    B.dictionary(d);
    return B;
  };

  var word = function(){
    return _G.word(_dictionary);
  };

  var words = function(count){
    return _G.words(_dictionary, count);
  };

  var sentence = function(){
    return _G.sentence(_dictionary);
  };

  var sentences = function(count){
    return _G.sentences(_dictionary, count);
  };

  var paragraph = function(){
    return _G.paragraph(_dictionary);
  };

  var paragraphs = function(count){
    return _G.paragraphs(_dictionary, count);
  };

  var parse = function(text){
    return _P.parse(_dictionary, text);
  };

  var dictionary = function(dictionary){
    if (typeof dictionary !== 'undefined')
      _dictionary = dictionary;
    return _dictionary;
  };

  return {
    createBlabot: createBlabot,
    word: word,
    words: words,
    sentence: sentence,
    sentences: sentences,
    paragraph: paragraph,
    paragraphs: paragraphs,
    parse: parse,
    dictionary: dictionary
  }
};

module.exports = new Blabot;