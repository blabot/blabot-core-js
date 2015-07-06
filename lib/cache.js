'use strict';

var Cache = function(){
  var _cache = {};

  var createCache = function(){
    return new Cache;
  };

  var has = function(key){
    return (typeof _cache[key] !== 'undefined');
  };

  // save(key, data, expireIn)
  // save(key, callback, expireIn)
  var save = function () {
    var key = arguments[0];
    var callback, data;
    if (typeof arguments[1] === 'function'){
      callback = arguments[1];
      data = callback.apply();
    } else {
      callback = null;
      data = arguments[1];
    }

    var expireIn = arguments[2];
    var expire;
    if (typeof expireIn !== 'undefined' && expireIn !== null){
      expire = Date.now() + expireIn;
    } else {
      expire = null;
    }

    _cache[key] = {
      'data': data,
      'expire': expire,
      'expireIn': expireIn,
      'callback': callback
    };
  };

  var load = function(key){
    if (!has(key))
      return null;

    if (_cache[key]['expire'] === null || _cache[key]['expire'] >= Date.now())
      return _cache[key]['data'];

    if (_cache[key]['expire'] < Date.now() && typeof _cache[key]['callback'] === 'function'){
      save(key, _cache[key]['callback'] ,_cache[key]['expireIn']);
      return _cache[key]['data'];
    }
    return null;
  };

  var remove = function(key){
    if (typeof _cache[key] === 'undefined')
      return true;
    delete _cache[key];
    return true;
  };


  return {
    createCache: createCache,
    save: save,
    load: load,
    remove: remove,
    has: has
  }
};

module.exports = new Cache;