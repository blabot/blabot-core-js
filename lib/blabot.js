'use strict';

var G = require('../lib/generator');
var P = require('../lib/parser');

exports.getWord = G.getWord;
exports.getWords = G.getWords;
exports.getSentence = G.getSentence;
exports.getSentences = G.getSentences;
exports.getParagraph = G.getParagraph;
exports.getParagraphs = G.getParagraphs;
exports.enableCache = G.enableCache;
exports.disableCache = G.disableCache;
exports.getCache = G.getCache;
exports.parse = P.parse;