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
            'css': file => {
                return `\t<link rel="stylesheet" type="text/css" href="${file}" />`;
            },
            'js': file => {
                return `\t<script type="text/javascript" src="${file}"></script>`;
            },
            'tmpl': file => {
                var text = grunt.file.read(basePath + '/' + file);
                var basename = file.split('.').slice(0, -1).join('').split('/').slice(-1).pop();
                return `\t<script id="tmpl_${basename}" type="text/html">${text}</script>`;
            }
        };

        var lines = [];
        for(var i=0; i<paths.length; i++){
            var fullPath = basePath + '/' + paths[i];
            var filelist = grunt.file.expand(fullPath);
            for(var j=0; j<filelist.length; j++) {
                var fn = '.' + filelist[j].substr(basePath.length);
                var parts = fn.split('.');
                if(!parts || parts.length === 0 || parts.length === 1){
                    continue;
                }
                var ext = parts.pop().toLowerCase();
                if( typeof handlers[ext] === 'function') {
                    lines.push(handlers[ext](fn));
                }
            }
        }

        var strPaths = JSON.stringify(paths);

        var expanded = `<!-- ${sectionName} ${strPaths} -->\n`;
        expanded += lines.join("\n");
        expanded += `\n\t<!-- /${sectionName} -->`;
        return expanded;
    }

    function expandSection(sectionName, basePath, fullInput) {

        var regexStart = new RegExp(`<!--\\s*${sectionName}(.*?)\\s*-->`);
        var regexEnd = new RegExp(`<!--\\s*\\/${sectionName}\\s*-->`);
        var eof = false;
        var offset = 0;

        while(!eof) {
            var input = fullInput.substr(offset);
            var resultStart = regexStart.exec(input);
            var resultEnd = regexEnd.exec(input);

            if(resultStart && resultEnd) {
                var startOfBlock = resultStart.index;
                var endOfBlock = (resultEnd.index + resultEnd[0].length);
                var sectionOldLength = endOfBlock - startOfBlock;
                var paths = [];
                try {
                    paths = JSON.parse(resultStart[1]);
                } catch (e) {
                    grunt.log.error('Failed to parse parameters for expand_section');
                    return;
                }
                var newSection = processSection(sectionName, basePath, paths);
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

      if(!sectionList || sectionList.length === 0) {
          grunt.log.error("Missing section names");
      }

      if(!fileList || fileList.length === 0) {
          grunt.log.error("Missing file list");
      }

      for(var s=0; s<sectionList.length; s++) {
          var sectionName = sectionList[s];
          if (!regex.test(sectionName)) {
              grunt.log.error("Invalid section name");
              return;
          }
          for (var i = 0; i < fileList.length; i++) {

              var files = grunt.file.expand(fileList[i]);

              for (var j = 0; j < files.length; j++) {
                  var fn = files[j];
                  var basePath = fn.split('/').slice(0, -1).join("/");
                  var output = expandSection(sectionName, basePath, grunt.file.read(files[j]));
                  grunt.file.write(files[j], output);
              }
          }
      }

  });

};
