var gulp = require('gulp'),
    sass = require('gulp-sass')
    autoprefixer = require('gulp-autoprefixer'),
    plumber = require('gulp-plumber'),
    rename = require('gulp-rename'),
    notify = require('gulp-notify'),
    browserSync = require('browser-sync').create(),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    stylelint = require('gulp-stylelint'),
    svgstore = require('gulp-svgstore'),
    svgmin = require('gulp-svgmin'),
    path = require('path');


var scssMain = './scss/**/*.scss';
var cssOutput = './assets/styles';

var jsMain = './assets/scripts/*.js';
var jsOutput = './assets/scripts/dist/';

var imagesMain = './assets/images/*';
var imagesOutput = './assets/images/dist/';

var svgSource = 'assets/images/svg/*';
var svgOutput = 'assets/images/svg/dist/'


// Compile SCSS

gulp.task('sass', function() {
    return gulp
        .src([scssMain, '!scss/mixins/**'])
        .pipe(plumber())
        .pipe(stylelint({
            reporters: [
                {
                    formatter: 'string', console: true
                }
            ]
        }))
        .pipe(rename({suffix: '.min'}))                 // find sass files in scss folder
        .pipe(sass({outputStyle: 'compact'}))        // run sass
        .on('error', function(err) {
            notify({
                title: 'CSS Task'
            }).write(err.line + ': ' + err.message);
            return this.emit('end');
        })
        .pipe(autoprefixer('last 2 version', 'ie 9'))   // run autoprefixer
        .pipe(gulp.dest(cssOutput))
        .pipe(browserSync.stream())
        .pipe(notify({ message: 'Compiled Sass! :)' }));
});



// Minify and concatenate scripts

gulp.task('scripts', function() {
    return gulp
        .src(jsMain)
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(concat('scripts.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(jsOutput))
        .pipe(notify({ message: 'Scripts concatenated & minified! :)' }));
});



// Minify images

gulp.task('images', () => {
    return gulp.src(imagesMain)
        .pipe(imagemin({
            progressive: true,
            optimizationLevel: 4,
            svgoPlugins: [
                {removeViewBox: false},
                {cleanupIDs: false}
            ],
            use: [pngquant()]
        }))
        .pipe(gulp.dest(imagesOutput));
});



// Combine svg sources into one file and generate <symbol> elements 

gulp.task('svg', function () {
    return gulp
        .src(svgSource)
        .pipe(svgmin(function (file) {
            var prefix = path.basename(file.relative, path.extname(file.relative));
            return {
                plugins: [{
                    cleanupIDs: {
                        prefix: prefix + '-',
                        minify: true
                    }
                }]
            }
        }))
        .pipe(svgstore())
        .pipe(gulp.dest(svgOutput));
});



// Static Server + watching scss/html files

gulp.task('serve', ['sass'], function() {

    browserSync.init({
        server: "./",
        //proxy: "localdomain.static",
        open: false,
        ghostMode: {
          scroll: true
        }
    });

    gulp.watch(scssMain, ['sass']).on('change', function (event) {
           console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
        });
    gulp.watch(jsMain, ['scripts']).on('change', browserSync.reload);;
    gulp.watch("*.html").on('change', browserSync.reload);

});



// Default Gulp task

gulp.task('default', ['serve']);