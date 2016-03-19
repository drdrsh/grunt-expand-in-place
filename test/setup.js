'use strict';

var grunt = require('grunt');
var config= require('./config.js');

exports['setup'] = {
  setUp: function(done) {
    /* This plugin changes target files in place, so we need to keep a template somewhere safe
     and create our fixture from it every time the test runs */

    grunt.file.delete(config.fixtureDir);
    grunt.file.mkdir(config.fixtureDir);

    var files = grunt.file.expand({ filter: grunt.file.isFile }, config.templateDir + '**/*');

    files.forEach(srcPath => {
      var dstPath = config.fixtureDir + srcPath.substr(config.templateDir.length);
      grunt.file.copy(srcPath, dstPath);
    });

    done();
  },

  main: function(test) {
    test.equal(1, 1, 'Setup complete');
    test.done();
  }
};
