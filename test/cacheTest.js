var assert = require('assert');
var should = require('should');
var Cache = require('../lib/cache');

describe('Cache', function () {
  var C;

  beforeEach(function () {
    C = Cache.createCache();
  });

  it('should save and load data', function(){
    var payload =['a','b','c','d','e'];
    (C.get('wrong key') === null).should.be.true;
    C.set('other data', payload);
    C.get('other data').should.eql(payload);
  });

  it('should hold data till expires', function(done){
    var payload = ['a','b','c','d','e'];
    C.set('payload', payload, 10);
    C.get('payload').should.eql(payload);
    setTimeout(function () {
      C.get('payload').should.eql(payload);
      setTimeout(function () {
        (C.get('payload') === null).should.be.true;
        done();
      }, 10);
    }, 5);
  });

  it('should reload from callback', function(done){
    var d;
    var fun1 = function(a, b, c){
      d = Date.now();
      return d + '-' + c + b + a;
    };
    C.set('key', function(){
      return fun1('z', 'y', 'x');
    }, 10);
    C.get('key').should.eql(d + '-xyz');
    setTimeout(function () {
      C.get('key').should.eql(d + '-xyz');
      setTimeout(function () {
        C.get('key').should.eql(d + '-xyz');
        done();
      }, 10);
    }, 5);
  });

  it('should remove item from cache', function(){
    var payload =['a','b','c','d','e'];
    C.set('any data', payload);
    C.get('any data').should.eql(payload);
    C.del('any data').should.be.true;
    (C.get('any data') === null).should.be.true;
  });

  it('should know if key exists', function(){
    var payload =['a','b','c','d','e'];
    C.set('asdf', payload);
    C.has('asdf').should.be.true;
    C.del('asdf').should.be.true;
    C.has('asdf').should.be.false;
  });

});