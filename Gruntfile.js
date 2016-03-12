/*
 * grunt-expand-in-place
 * https://github.com/drdrsh/grunt-expand-in-place
 *
 * Copyright (c) 2016 Mostafa Abdelraouf
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['test/fixtures']
    },

    // Configuration to be run (and then tested).
    'expand-in-place': {
        'dev': {
          'target' : ['test/fixtures/*.html']
        }
    },

    // Unit tests.
    nodeunit: {
      setup: ['test/setup.js'],
      tests: ['test/*_test.js']
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  grunt.registerTask('test', ['jshint:all', 'clean', 'nodeunit:setup', 'expand-in-place', 'nodeunit:tests']);

  grunt.registerTask('default', ['test']);

};
