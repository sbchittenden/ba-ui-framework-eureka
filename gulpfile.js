var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var gulpLoadPlugins = require('gulp-load-plugins');
var plugins = gulpLoadPlugins();
var pump = require('pump');

// assset paths
var js = ['dev/javascript/*.js'];
var scss = 'dev/styles/sass/**/*.scss';
var css = 'dev/styles/css/*.css';
var images = 'dev/images/**/*';

gulp.task('sass', function() {
  return gulp.src(scss)
    .pipe(plugins.sass().on('error', plugins.sass.logError))
    .pipe(gulp.dest('dev/styles/css'));
});

// convert es2015 to allow for uglify()
gulp.task('babel', function() {
  return gulp.src(js)
    .pipe(plugins.babel({
      presets: ['es2015']
    }))
    .pipe(gulp.dest('dev/javascript/transpiled'));
});

// concat all js files together
gulp.task('concat', function() {
  return gulp.src('dev/javascript/transpiled/*.js')
    .pipe(plugins.concat('app.js'))
    .pipe(gulp.dest('dev/javascript/app'));
});

// compress js files
gulp.task('compress', function(cb) {
  pump([
      gulp.src(js),
      concat(),
      plugins.uglify(),
      gulp.dest('dist')
    ],
    cb
  );
});

// process images
gulp.task('minify-img', () => {
  return gulp.src(images)
    .pipe(plugins.imagemin())
    .pipe(gulp.dest('dist/images'));
});

gulp.task('copy', () => {
  return gulp.src('dev/index.html')
    .pipe(gulp.dest('dist'));
});

// transpile, concat, minify, and rename all js files
gulp.task('minify-js', () => {
  return gulp.src(js)
    .pipe(plugins.babel({ presets: ['es2015'] }))
    .pipe(plugins.concat('js/app.js'))
    .pipe(gulp.dest('dist'))
    .pipe(plugins.rename('app.min.js'))
    .pipe(plugins.uglify())
    .pipe(gulp.dest('dist/js'));
});

gulp.task('minify-css', () => {
  return gulp.src(scss)
    .pipe(plugins.sass().on('error', plugins.sass.logError))
    .pipe(gulp.dest('dev/css'))
    .pipe(plugins.autoprefixer())
    .pipe(plugins.cleanCss())
    .pipe(plugins.rename('app.min.css'))
    .pipe(gulp.dest('dist/css'));
});

// Static Server + watching scss/html files
gulp.task('serve', ['sass'], function() {
  browserSync.init({
    server: "./dist"
  });

  gulp.watch(scss ['sass']);
  gulp.watch("dev/*.html").on('change', browserSync.reload);
});

gulp.task('js-watch', ['minify-js', 'copy'], function (done) {
    browserSync.reload();
    done();
});

gulp.task('watch', ['serve'], () => {
  gulp.watch(js, ['js-watch']);
  gulp.watch(scss, ['minify-css', 'copy']);
});

gulp.task('default', ['minify-js', 'minify-css', 'copy']);
