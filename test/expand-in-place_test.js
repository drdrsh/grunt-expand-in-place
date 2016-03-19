'use strict';

var grunt = require('grunt');
var config= require('./config.js');

var templateDir = config.templateDir;
var fixtureDir  = config.fixtureDir;
var expectedDir = config.expectedDir;


exports['expand-in-place'] = {
  setUp: function(done) {
    done();
  },

  general: function(test) {

    var files = grunt.file.expand({ filter : grunt.file.isFile }, expectedDir + '/*');

    //test.expect(files.length * 2);

    files.forEach((file) => {
      var basename = file.substr(expectedDir.length);
      test.equal(grunt.file.exists(fixtureDir + basename), true, 'Make sure a fixture files exists for each expected file');

      var actual = grunt.file.read(fixtureDir + basename).replace(/\n|\r/g, '');
      var expected = grunt.file.read(file).replace(/\n|\r/g, '');

      test.equal(actual, expected, 'Does the observed processed file match the expected file');
    });

    test.done();
  }
};
