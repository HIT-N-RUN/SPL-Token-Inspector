'use strict';
var expect = require('chai').expect;
var index = require('../dist/index.js');

describe('getPlural function test', () => {
  it('should return True', () => {
    var result = index.log('title', 'data');
    expect(result).to.equal(true);
  })
})