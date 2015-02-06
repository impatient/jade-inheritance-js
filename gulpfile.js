'use strict';

var gulp   = require('gulp');
var plugins = require('gulp-load-plugins')();
var to5 = require('gulp-6to5');
var sourcemaps = require('gulp-sourcemaps');
var runSequence = require('run-sequence');

var paths = {
  es6: [ './es6-lib/**/*.js'],
  watch: ['./gulpfile.js', './es6-lib/**', './test/**/*.js', '!test/{temp,temp/**}'],
  tests: ['./test/**/*.js', '!test/{temp,temp/**}']
};

var plumberConf = {};

if (process.env.CI) {
  plumberConf.errorHandler = function(err) {
    throw err;
  };
}


gulp.task('unitTest', function () {
  gulp.src(paths.tests, {cwd: __dirname})
    .pipe(plugins.plumber(plumberConf))
    .pipe(plugins.mocha({ reporter: 'list' }));
});

gulp.task('6to5', function() {

  return gulp.src(paths.es6)
    .pipe(sourcemaps.init())
    .pipe(to5({optional: ["selfContained"]}))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./lib/'));

});

gulp.task('bump', ['test'], function () {
  var bumpType = plugins.util.env.type || 'patch'; // major.minor.patch

  return gulp.src(['./package.json'])
    .pipe(plugins.bump({ type: bumpType }))
    .pipe(gulp.dest('./'));
});

gulp.task('watch', ['test'], function () {
  gulp.watch(paths.watch, ['test'] )
});


gulp.task('test', function(cb) {
   return runSequence('6to5','unitTest',cb);
});

gulp.task('release', ['bump']);

gulp.task('default', ['test']);
