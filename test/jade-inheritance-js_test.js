'use strict';

var JadeInheritance = require('../lib/jade-inheritance-js');
var should = require('should');
var path = require('path');


describe('jadeInheritanceJs', function () {

  var inheritance;

  beforeEach(function() {

    inheritance = new JadeInheritance( { basedir:  'test-files/jade-simple' } );

  });

  it('should exist', function () {
    should.exist(inheritance);
  });

  it('should have an entry for every jade file', function (cb) {
    inheritance.loaded.then(function() { inheritance.files.length.should.equal(4); cb();} );
  });



});
