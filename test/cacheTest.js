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
    (C.load('wrong key') === null).should.be.true;
    C.save('other data', payload);
    C.load('other data').should.eql(payload);
  });

  it('should hold data till expires', function(done){
    var payload = ['a','b','c','d','e'];
    C.save('payload', payload, 10);
    C.load('payload').should.eql(payload);
    setTimeout(function () {
      C.load('payload').should.eql(payload);
      setTimeout(function () {
        (C.load('payload') === null).should.be.true;
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
    C.save('key', function(){
      return fun1('z', 'y', 'x');
    }, 10);
    C.load('key').should.eql(d + '-xyz');
    setTimeout(function () {
      C.load('key').should.eql(d + '-xyz');
      setTimeout(function () {
        C.load('key').should.eql(d + '-xyz');
        done();
      }, 10);
    }, 5);
  });

  it('should remove item from cache', function(){
    var payload =['a','b','c','d','e'];
    C.save('any data', payload);
    C.load('any data').should.eql(payload);
    C.remove('any data').should.be.true;
    (C.load('any data') === null).should.be.true;
  });

  it('should know if key exists', function(){
    var payload =['a','b','c','d','e'];
    C.save('asdf', payload);
    C.has('asdf').should.be.true;
    C.remove('asdf').should.be.true;
    C.has('asdf').should.be.false;
  });

});