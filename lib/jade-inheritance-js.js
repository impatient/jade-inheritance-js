/*
 * jade-inheritance-js
 * https://github.com/impatient/jade-inheritance-js
 *
 * Copyright (c) 2015 Scott Dillender
 * Licensed under the  license.
 */

"use strict";

var _to5Helpers = require("6to5-runtime/helpers");

var _regeneratorRuntime = require("6to5-runtime/regenerator");

var _core = require("6to5-runtime/core-js");

var emitParser = _regeneratorRuntime.mark(function emitParser(parser) {
  var type;
  return _regeneratorRuntime.wrap(function emitParser$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        if (!((type = parser.peek().type) != "eos")) {
          context$1$0.next = 14;
          break;
        }
        if (!(type === "extends")) {
          context$1$0.next = 6;
          break;
        }
        context$1$0.next = 4;
        return {
          type: type,
          filePath: parser.advance().val.trim()
        };
      case 4:
        context$1$0.next = 12;
        break;
      case 6:
        if (!(type === "include")) {
          context$1$0.next = 11;
          break;
        }
        context$1$0.next = 9;
        return {
          type: type,
          filePath: parser.advance().val.trim()
        };
      case 9:
        context$1$0.next = 12;
        break;
      case 11:
        parser.advance();
      case 12:
        context$1$0.next = 0;
        break;
      case 14:
      case "end":
        return context$1$0.stop();
    }
  }, emitParser, this);
});

var path = require("path");
var glob = require("glob");
var JadeParser = require("jade/lib/parser");
var fs = require("fs");


var JadeInheritance = (function () {
  function JadeInheritance() {
    var _this = this;
    var options = arguments[0] === undefined ? {} : arguments[0];
    _to5Helpers.classCallCheck(this, JadeInheritance);

    this.basedir = options.basedir || process.cwd();
    this.cache = {};
    this.options = options;
    this.loaded = new _core.Promise(function (res, rej) {
      glob(path.join(_this.basedir, "/**/*.jade"), function (err, files) {
        if (err) {
          console.log("Error", err);
          return;
        }


        _this.files = files.map(function (f) {
          return path.relative(_this.basedir, f);
        });

        files.map(_this.addFile.bind(_this));


        _this.buildIncludeCache();
        _this.buildExtendCache();
        res();
      });

    });

  }

  _to5Helpers.prototypeProperties(JadeInheritance, null, {
    showDirtyFiles: {
      value: function showDirtyFiles(test) {
        var _this = this;
        var dirtyFiles = arguments[1] === undefined ? [] : arguments[1];
        dirtyFiles.push(test);
        var includes = this.includedByCache[test] || [];
        var directExtends = this.extendedByCache[test] || [];
        var both = includes.concat(directExtends);
        both.forEach(function (inc) {
          if (! ~dirtyFiles.indexOf(inc)) {
            _this.showDirtyFiles(inc, dirtyFiles);
          }
        });

        return dirtyFiles;
      },
      writable: true,
      configurable: true
    },
    buildIncludeCache: {
      value: function buildIncludeCache() {
        var _this = this;


        var includeCache = {};
        _core.Object.keys(this.cache).forEach(function (ofile) {
          var file = _this.cache[ofile];
          (file.include || []).map(function (included) {
            includeCache[included] = includeCache[included] || [];
            includeCache[included].push(ofile);
          });
        });

        this.includedByCache = includeCache;

      },
      writable: true,
      configurable: true
    },
    buildExtendCache: {
      value: function buildExtendCache() {
        var _this = this;


        var extendCache = {};
        _core.Object.keys(this.cache).forEach(function (ofile) {
          var file = _this.cache[ofile];
          (file["extends"] || []).map(function (extended) {
            extendCache[extended] = extendCache[extended] || [];
            extendCache[extended].push(ofile);
          });
        });

        this.extendedByCache = extendCache;
      },
      writable: true,
      configurable: true
    },
    addFile: {
      value: function addFile(file) {
        var basedir = this.basedir;
        var contents = fs.readFileSync(file, "utf8");
        var currentFile = path.relative(basedir, file);

        var parser = new JadeParser(contents, file, this.options);
        for (var _iterator = _core.$for.getIterator(emitParser(parser)), _step; !(_step = _iterator.next()).done;) {
          var relatedFile = _step.value;
          var filePath = relatedFile.filePath;
          var type = relatedFile.type;
          var relative = path.relative(this.basedir, parser.resolvePath(filePath, type));
          this.cache[currentFile] = this.cache[currentFile] || {};
          this.cache[currentFile][type] = this.cache[currentFile][type] || [];
          this.cache[currentFile][type].push(relative);
        }
      },
      writable: true,
      configurable: true
    },
    updateFile: {
      value: function updateFile(file) {
        var basedir = this.basedir;
        var currentFile = path.relative(basedir, file);


        delete this.cache[currentFile];
        this.addFile(file);

        this.buildIncludeCache();
        this.buildExtendCache();
      },
      writable: true,
      configurable: true
    }
  });

  return JadeInheritance;
})();

module.exports = JadeInheritance;
//# sourceMappingURL=jade-inheritance-js.js.map