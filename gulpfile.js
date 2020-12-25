// Default Plug
const { src, dest, parallel, watch, series } = require('gulp');
// Gulp
const gulp = require('gulp');
// Minify HTML files
const htmlmin = require('gulp-htmlmin');
// SASS Compailer
const sass = require("gulp-sass");
// Old browser compability
const autoprefixer = require('gulp-autoprefixer');
//Minify CSS files
const cleanCSS = require('gulp-clean-css');
//Remove Unused CSS
const purgecss = require('gulp-purgecss');
//Rename Files
const rename = require("gulp-rename");
// Merge all js files into one
const concat = require('gulp-concat');
// Minified js
const uglify = require('gulp-uglify');
//Minifies Images
const imagemin = require('gulp-imagemin');
//BrowserSync
const browserSync = require('browser-sync').create();



function html() {
    return src('./*.html')
      .pipe(htmlmin({ collapseWhitespace: true }))
      .pipe(dest('build'))
  }


function css() {
    return gulp.src('./scss/main.scss')
      .pipe(sass().on('error', sass.logError))
      .pipe(autoprefixer())
    .pipe(
      purgecss({
        content: ['./build/*.html']
      }))
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(rename("style.min.css"))
      .pipe(gulp.dest('./build/assets/css'));
  };

function scripts() {
    return gulp.src('./js/*.js')
      .pipe(concat('scripts.min.js'))
      .pipe(uglify())
      .pipe(gulp.dest('./build/assets/js'));
  };

function imgmin(){
   return gulp.src('./images/*')
        .pipe(imagemin([
          imagemin.gifsicle({interlaced: true}),
          imagemin.jpegtran({progressive: true}),
          imagemin.optipng({optimizationLevel: 5}), 
         ]))
        .pipe(gulp.dest('./build/assets/img'))
};

function live() {
    gulp.watch('./*.html',html);
    gulp.watch('./scss/*.scss',css);
    gulp.watch('./js/*.js',scripts);
}
  
function browsersync() {
    browserSync.init({
        server: {
            baseDir: "./build"
        }
    });
    
    gulp.watch(['./build/*.html','./build/assets/css/*.css','./build/assets/js/*.js']).on('change', browserSync.reload);

}

exports.imgmin = imgmin
exports.scripts = scripts
exports.live = live
exports.css = css
exports.html = html 
exports.browserSync = browserSync  
exports.default = parallel(html,css,scripts,live,browsersync);



