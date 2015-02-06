/*
 * jade-inheritance-js
 * https://github.com/impatient/jade-inheritance-js
 *
 * Copyright (c) 2015 Scott Dillender
 * Licensed under the  license.
 */

'use strict';

var path = require('path');
var glob = require('glob');
var JadeParser = require('jade/lib/parser');
var fs = require('fs');


function * emitParser (parser) {
  var type;
  while ((type = parser.peek().type) != 'eos') {
    if (type === 'extends') {
      yield {
        type: type,
        filePath: parser.advance().val.trim()
      }
    }
    else if (type === 'include') {
      yield {
        type: type,
        filePath: parser.advance().val.trim()
      }
    }
    else {
      parser.advance();
    }
  }

}

class JadeInheritance {
  constructor(options = {}) {
    this.basedir = options.basedir || process.cwd();
    this.cache = {};
    this.options = options;
    this.loaded = new Promise((res, rej) => {

      glob(path.join(this.basedir, '/**/*.jade'), (err, files) => {
        if (err) {
          console.log('Error', err);
          return;
        }


        this.files = files.map(f => path.relative(this.basedir, f));

        files.map(this.addFile.bind(this));


        this.buildIncludeCache();
        this.buildExtendCache();
        res();

      });


    });


  }

  showDirtyFiles(test, dirtyFiles = []) {
    dirtyFiles.push(test);
    var includes = this.includedByCache[test] || [];
    var directExtends = this.extendedByCache[test] || [];
    var both = includes.concat(directExtends);
    both.forEach((inc) => {
        if (!~dirtyFiles.indexOf(inc)) {
          this.showDirtyFiles(inc, dirtyFiles);
        }
      }
    );

    return dirtyFiles;
  }

  buildIncludeCache() {

    var includeCache = {};
    Object.keys(this.cache)
      .forEach(ofile => {
        var file = this.cache[ofile];
        (file.include || [])
          .map(included => {
            includeCache[included] = includeCache[included] || [];
            includeCache[included].push(ofile);
          });
      });

    this.includedByCache = includeCache;


  }

  buildExtendCache() {

    var extendCache = {};
    Object.keys(this.cache)
      .forEach(ofile => {
        var file = this.cache[ofile];
        (file.extends || [])
          .map(extended => {
            extendCache[extended] = extendCache[extended] || [];
            extendCache[extended].push(ofile);
          });
      });

    this.extendedByCache = extendCache;

  }

  addFile(file) {

    var basedir = this.basedir;
    var contents = fs.readFileSync(file, 'utf8')
    let currentFile = path.relative(basedir, file);

    var parser = new JadeParser(contents, file, this.options);
    for (var relatedFile of emitParser(parser)) {
      let {filePath, type} = relatedFile;
      let relative = path.relative(this.basedir, parser.resolvePath(filePath, type));
      this.cache[currentFile] = this.cache[currentFile] || {};
      this.cache[currentFile][type] = this.cache[currentFile][type] || [];
      this.cache[currentFile][type].push(relative);

    }

  }

  updateFile(file) {

    var basedir = this.basedir;
    let currentFile = path.relative(basedir, file);


    delete this.cache[currentFile];
    this.addFile(file);

    this.buildIncludeCache();
    this.buildExtendCache();
  }


}

module.exports = JadeInheritance
