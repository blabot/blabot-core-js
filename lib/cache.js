'use strict';

var Cache = function(){
  var _cache = {};

  var createCache = function(){
    return new Cache;
  };

  var has = function(key){
    return (typeof _cache[key] !== 'undefined');
  };

  // set(key, data|callback, [TTL])
  var set = function () {
    var key = arguments[0];
    var callback, data;
    if (typeof arguments[1] === 'function'){
      callback = function () {
        return set.apply(null, arguments);
      };
      data = arguments[1].apply();
    } else {
      callback = function () {
        return del(key);
      };
      data = arguments[1];
    }

    var expireIn = arguments[2];
    if (typeof expireIn !== 'undefined' && expireIn !== null){
      setTimeout(callback, expireIn);
    }

    _cache[key] = {
      data: data,
      expireIn: expireIn
    };
  };

  var get = function(key){
    if (has(key))
      return _cache[key].data;
    return null;
  };

  var del = function(key){
    if (typeof _cache[key] === 'undefined')
      return false;
    delete _cache[key];
    return true;
  };

  return {
    createCache: createCache,
    set: set,
    get: get,
    del: del,
    remove: del,
    has: has
  }
};

module.exports = new Cache;