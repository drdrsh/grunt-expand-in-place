/*
 * grunt-expand-in-place
 * https://github.com/drdrsh/grunt-expand-in-place
 *
 * Copyright (c) 2016 Mostafa Abdelraouf
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {
  function processSection(sectionName, basePath, paths) {
    var handlers = {
      css: file => `\t<link rel="stylesheet" type="text/css" href="${file}" />`,
      js: file => `\t<script type="text/javascript" src="${file}"></script>`,
      tmpl: (file) => {
        var text = grunt.file.read(basePath + '/' + file);
        var basename = file.split('.').slice(0, -1).join('').split('/').slice(-1).pop();
        return `\t<script id="tmpl_${basename}" type="text/html">${text}</script>`;
      }
    };

    var lines = [];

    paths.forEach((path) => {
      var fullPath = basePath + '/' + path;
      var filelist = grunt.file.expand(fullPath);

      filelist.forEach((file) => {
        var fn = '.' + file.substr(basePath.length);
        var parts = fn.split('.');

        if (!parts || parts.length <= 1) {
          return;
        }

        var ext = parts.pop().toLowerCase();

        if (typeof handlers[ext] === 'function') {
          lines.push(handlers[ext](fn));
        }
      });
    });

    var strPaths = JSON.stringify(paths);

    var expanded = `<!-- ${sectionName} ${strPaths} -->\n`;
    expanded += lines.join('\n');
    expanded += `\n\t<!-- /${sectionName} -->`;

    return expanded;
  }

  function expandSection(sectionName, basePath, fullInput) {
    var regexStart = new RegExp(`<!--\\s*${sectionName}(.*?)\\s*-->`);
    var regexEnd = new RegExp(`<!--\\s*\\/${sectionName}\\s*-->`);
    var eof = false;
    var offset = 0;

    while (!eof) {
      let input = fullInput.substr(offset);
      let resultStart = regexStart.exec(input);
      let resultEnd = regexEnd.exec(input);

      if (resultStart && resultEnd) {
        let startOfBlock = resultStart.index;
        let endOfBlock = resultEnd.index + resultEnd[0].length;
        let sectionOldLength = endOfBlock - startOfBlock;
        let paths;

        try {
          paths = JSON.parse(resultStart[1]);
        } catch (e) {
          grunt.log.error('Failed to parse parameters for expand_section');
          return;
        }

        let newSection = processSection(sectionName, basePath, paths);
        fullInput = fullInput.substr(0, startOfBlock + offset) + newSection + fullInput.substr(offset + endOfBlock);
        offset += startOfBlock + newSection.length;
      } else {
        eof = true;
      }
    }

    return fullInput;
  }

  grunt.registerMultiTask('expand-in-place', 'CSS/Javascript header tags in-place injector', function() {
    var regex = /^[A-Za-z0-9_]+$/im;
    grunt.file.defaultEncoding = 'utf8';

    var sectionList = ['expand_section'];
    var fileList = this.data.target;
    var filesToWrite = {};

    if (!sectionList || !sectionList.length) {
      grunt.log.error('Missing section names');
    }

    if (!fileList || !fileList.length) {
      grunt.log.error('Missing file list');
    }

    sectionList.every((sectionName) => {
      if (!regex.test(sectionName)) {
        grunt.log.error('Invalid section name');
        return false;
      }

      fileList.forEach((file) => {
        var files = grunt.file.expand(file);

        files.forEach((fileName) => {
          var basePath = fileName.split('/').slice(0, -1).join('/');
          var output = expandSection(sectionName, basePath, grunt.file.read(fileName));

          grunt.file.write(fileName, output);
        });
      });

      return true;
    });
  });
};
