'use strict';

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    plumber = require('gulp-plumber'),
    rename = require('gulp-rename'),
    notify = require('gulp-notify'),
    browserSync = require('browser-sync').create(),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    stylelint = require('gulp-stylelint'),
    svgstore = require('gulp-svgstore'),
    svgmin = require('gulp-svgmin'),
    path = require('path'),
    webpack = require('webpack-stream'),
    webpackConfig = require('./webpack.config.js'),
    config = require('./config.json');

// Compile SCSS
gulp.task('sass', () => {
  return gulp
    .src([config.styles.scss, config.styles.ignore])
    .pipe(plumber())
    .pipe(stylelint({
      reporters: [{
        formatter: 'string',
        console: true
      }]
    }))
    .pipe(sass({ outputStyle: config.styles.outputStyle }))
    .on('error', (err) => {
      notify({
        title: 'CSS Task'
      }).write(err.line + ': ' + err.message);
      return this.emit('end');
    })
    .pipe(autoprefixer('last 2 versions', 'ie 9')) // run autoprefixer
    .pipe(rename(config.styles.outputName))
    .pipe(gulp.dest(config.styles.output))
    .pipe(notify({ message: 'Compiled Sass! :)' }));
});

// Minify and concatenate scripts
gulp.task('scripts', () => {
  return gulp
    .src(config.scripts.entry)
    .pipe(plumber())
    .pipe(jshint())
    .pipe(jshint.reporter(stylish))
    .pipe(webpack(webpackConfig))
    .pipe(uglify())
    .pipe(gulp.dest(config.scripts.output));
});

// Wait for webpack to finish bundling JS assets before reloading browser
gulp.task('scripts-watch', ['scripts'], (done) => {
  browserSync.reload();
  done();
});

// Minify images

gulp.task('images', () => {
  return gulp.src(config.images.input)
    .pipe(imagemin({
      progressive: true,
      optimizationLevel: 4,
      svgoPlugins: [
        { removeViewBox: false },
        { cleanupIDs: false }
      ],
      use: [pngquant()]
    }))
    .pipe(gulp.dest(config.images.output));
});

// Combine svg sources into one file and generate <symbol> elements
gulp.task('svg', () => {
  return gulp
    .src(config.images.svg.input)
    .pipe(svgmin((file) => {
      var prefix = path.basename(file.relative, path.extname(file.relative));
      return {
        plugins: [{
          cleanupIDs: {
            prefix: prefix + '-',
            minify: true
          }
        }]
      };
    }))
    .pipe(svgstore())
    .pipe(gulp.dest(config.images.svg.output));
});

// Static Server + watch scss/js/html files
gulp.task('serve', ['sass'], () => {

  browserSync.init({
    server: './',
    //proxy: "localdomain.static",
    open: false,
    ghostMode: {
      scroll: true
    }
  });

  gulp.watch(config.styles.scss, ['sass']).on('change', (event) => {
    console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
  });
  gulp.watch(config.scripts.input, ['scripts-watch']);
  gulp.watch('*.html').on('change', browserSync.reload);

});

// Default Gulp task
gulp.task('default', ['serve']);
