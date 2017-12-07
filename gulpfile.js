/**
 * Basic gulp file for static site development.
 * 
 */
/* eslint-env node */

'use strict'

var gulp = require('gulp')
var sass = require('gulp-sass')
var sourcemaps = require('gulp-sourcemaps')
var prefix = require('gulp-autoprefixer')
var connect = require('gulp-connect')
var eyeglass = require("eyeglass")
var kss = require('kss')
var eslint = require('gulp-eslint')
var babel = require('gulp-babel')
var concat = require('gulp-concat')
var htmlmin = require('gulp-htmlmin')
var uglify = require('gulp-uglify')
var del = require('del')
var imagemin = require('gulp-imagemin')
var workbox = require('workbox-build')
var runSequence = require('run-sequence')
var dist = './dist'
//
// Begin Gulp Tasks.
//

//
// Workbox
//
gulp.task('generate-service-worker', () => {
  return workbox.generateSW({
    globDirectory: dist,
    globPatterns: ['**\/*.{html,js,css,png,jpg,ico,json}'],
    swDest: `${dist}/sw.js`,
    clientsClaim: true,
    skipWaiting: true
  }).then(() => {
    console.info('Service worker generation completed.');
  }).catch((error) => {
    console.warn('Service worker generation failed: ' + error);
  });
});

//
// HTML Dev Workflow.
//
gulp.task('html:dev', function () {
  return gulp.src(['src/**/*html', '!src/sass/**/*'])
    .pipe(gulp.dest('.tmp'))
    .pipe(connect.reload())
})

//
// HTML Prod Workflow.
//
gulp.task('html:prod', function () {
  return gulp.src(['src/**/*html', '!src/sass/**/*'])
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('dist'))
})
//
// Manifest Dev Workflow
//
gulp.task('manifest:dev', function(){
  return gulp.src('src/*.json')
  .pipe(gulp.dest('.tmp'))
  .pipe(connect.reload())
})

//
// Manifest Prod Workflow
//
gulp.task('manifest:prod', function(){
  return gulp.src('src/*.json')
  .pipe(gulp.dest('dist'))
  .pipe(connect.reload())
})

//
// Images Dev Workflow.
//
gulp.task('images:dev', function () {
  return gulp.src('src/**/*.{png,jpg,jpeg,gif,svg,ico}')
    .pipe(gulp.dest('.tmp'))
    .pipe(connect.reload())
})

//
// Images Prod Workflow.
//
gulp.task('images:prod', function () {
  return gulp.src('src/**/*.{png,jpg,jpeg,gif,svg,ico}')
    .pipe(imagemin())
    .pipe(gulp.dest('dist'))
})

//
// Fonts Dev Workflow.
//
gulp.task('fonts:dev', function () {
  return gulp.src('src/**/*.{woff,woff2}')
    .pipe(gulp.dest('.tmp'))
    .pipe(connect.reload())
})

//
// Fonts Prod Workflow.
//
gulp.task('fonts:prod', function () {
  return gulp.src('src/**/*.{woff,woff2}')
  .pipe(gulp.dest('dist'))
})

//
// CSS Dev Workflow.
//
gulp.task('styles:dev', function () {
  return gulp.src('src/sass/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass(eyeglass({
      outputStyle: 'expanded',
      eyeglass: {
        enableImportOnce: false
      }
    })).on('error', sass.logError))
    .pipe(prefix(['last 2 versions']))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('.tmp/css'))
    .pipe(connect.reload())
})

//
// CSS Prod Workflow.
//
gulp.task('styles:prod', function () {
  return gulp.src('src/sass/**/*.scss')
    .pipe(sass(eyeglass({
      outputStyle: 'compressed',
      eyeglass: {
        enableImportOnce: false
      }
    })).on('error', sass.logError))
    .pipe(prefix(['last 2 versions']))
    .pipe(gulp.dest('dist/css'))
})

//
// Javascript Dev Workflow.
//
gulp.task('js:dev', function () {
  return gulp.src('src/js/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['env']
    }))
    .pipe(concat('script.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('.tmp/js'))
})

//
// Javascript Prod Workflow.
//
gulp.task('js:prod', function () {
  return gulp.src('src/js/**/*.js')
    .pipe(babel({
      presets: ['env']
    }))
    .pipe(concat('script.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'))
})

//
// KSS Styleguide.
//

gulp.task('styleguide:generate', function () {
  return kss({
    source: 'src/sass',
    destination: 'styleguide',
    css: '../css/styles.css',
    homepage: 'styleguide.md'
  })
})

gulp.task('styleguide:watch', function () {
  gulp.watch('src/sass/**/*', ['styleguide:generate'])
})

//
// Dev server.
//
gulp.task('connect', function () {
  connect.server({
    livereload: true,
    root: '.tmp'
  })
})

gulp.task('connect', function(){
  connect.server({
    livereload: true,
    root: 'dist'
  })
})

//
// Watch task.
//
gulp.task('watch', function () {
  gulp.watch('src/sass/**/*.scss', ['styles:dev'])
  gulp.watch('src/**/*.html', ['html:dev'])
  gulp.watch('src/**/*.(png|jpe?g|jpg|svg|gif|ico)', ['images:dev'])
  gulp.watch('src/**/*.(woff|woff2)', ['fonts:dev'])
  gulp.watch('src/js/**/*.js', ['js:dev'])
})

gulp.task('clean', function () {
  return del([
    '.tmp',
    'styleguide',
    'dist'
  ])
})

//
// Composite Task declarations.
//
gulp.task('build',function(){
  runSequence(['html:prod', 'images:prod','fonts:prod', 'styles:prod', 'js:prod','manifest:prod','connect'],'generate-service-worker')
})

gulp.task('dev',function(){
  runSequence(['html:dev', 'images:dev','fonts:dev', 'styles:dev', 'js:dev','manifest:dev','connect'],'generate-service-worker')
})
gulp.task('styleguide', ['styleguide:generate', 'styleguide:watch'])
