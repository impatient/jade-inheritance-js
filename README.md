# jade-inheritance-js 
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-url]][daviddm-image] [![Coverage Status][coveralls-image]][coveralls-url]

Lib to keep track of 


## Install

```bash
$ npm install --save jade-inheritance-js
```


## Usage

```javascript
var JadeInheritance = require('jade-inheritance-js');
//To initialize
var inheritance = new JadeInheritance({ basedir: '/path/here' })
//To use
inheritance.showDirtyFiles('changed/file/here'); //returns list of files that need to be recompiled
//To update
inheritance.updateFile('/path/here')
  
```



## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [gulp](http://gulpjs.com/).


## License

Copyright (c) 2015 Scott Dillender. Licensed under the MIT license.
