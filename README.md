# Blabot – JavaScript powered Core

Blabot is exceptionally language faithful generator of dummy text. 
Feel free to have some fun using [Blabot.net](http://blabot.net)

## Usage
```javascript
var Blabot  = require('blabot-core'),
    fs      = require('fs');

var dictionaryFilePath = __dirname + '/blabot-dictionary.json';

if (!fs.existsSync(dictionaryFilePath))
  throw new Error('Can’t find file \'' + dictionaryFilePath + '\'\n');

var dictionaryJSON = fs.readFileSync(dictionaryFilePath, 'utf-8');
var dictionary = JSON.parse(dictionaryJSON);
var sentences = Blabot.getSentences(dictionary, 5);

console.log(sentences);
```

## API

### Generator

- Blabot.getWord(dictionary)
  - Return one random word
- Blabot.getWords(dictionary, count)
  - Return N random words as array
- Blabot.getSentence(dictionary)
  - Return one sentence with random words
- Blabot.getSentences(dictionary, count)
  - Return N random sentences as array
- Blabot.getParagraph(dictionary)
  - Return one random paragraph with random count of 5–10 sentences
- Blabot.getParagraphs(dictionary, count)
  - Return N random paragraphs as array
  
### Cache

- Blabot.enableCache(dictionary, [size=7])
  - Warm up cache and all generator will automagically became superfast  
- Blabot.disableCache()
  - Disable all cache goodness and purge cache
- Blabot.getCache()
  - Returns cache object

### Parser

- Blabot.parse(dictionary, text)
  - Parse given text into dictionary by dictionary.config rules
  
### Dictionary

Empty english-dictionary.json file may looks like this:

```json
{
  "meta": {
    "name": "Example dictionary",
    "description": "Default EN Blabot dictionary template",
    "author": "Tomas Kuba",
    "created": "2014-12-01 09:41:00",
    "updated": "2014-12-01 09:41:01"
  },
  "config": {
    "normalizingRules": [
      ["\\.\\.\\.", "."],
      ["\\s+"," "],
      [" , ", ", "]
    ],
    "badWords": ["shit","fuck"],
    "specialWordChars": "’'—.",
    "sentenceDelimiters": "!.?…",
    "language": "en"
  },
  "words": {
    "2": [
      "is",
      "at"
    ],
    "3": [
      "not",
      "any",
      "all"
    ],
    "4": [
      "well",
      "this",
      "some",
      "text",
      "easy"
    ]
  },
  "sentences": [
    "<3>, <4> <2> <4> <4>.",
    "<4> <2> <4>’ <4> <2> <3>!"
  ]
}
```

## Blabot CLI

Feel free to use [Blabot CLI](https://github.com/blabot/blabot-cli) for simple
initiation, text parsing and blabols generation.