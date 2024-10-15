const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const cleanCSS = require('gulp-clean-css');
const rename = require('gulp-rename');
const htmlReplace = require('gulp-html-replace');
const browserSync = require('browser-sync').create();
const imagemin = require('gulp-imagemin');

// Paths configuration
const paths = {
  scss: './app/scss/**/*.scss',
  css: './dist/css',
  htmlSrc: './app/index.html',
  htmlDest: './dist',
  imagesSrc: './app/images/**/*',
  imagesDest: './dist/images',
  fontsSrc: './app/fonts/**/*',  // All fonts inside 'fonts' folder
  fontsDest: './dist/fonts',     // Destination for fonts
};

// Compile SCSS to CSS and minify it
gulp.task('css', function () {
  return gulp
    .src('./app/scss/styles.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(cleanCSS())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(paths.css))
    .pipe(browserSync.stream()); // Inject CSS without full reload
});

// Copy HTML and replace CSS paths
gulp.task('html', function () {
  return gulp
    .src(paths.htmlSrc)
    .pipe(
      htmlReplace({
        css: 'css/styles.min.css',
      })
    )
    .pipe(gulp.dest(paths.htmlDest));
});

// Copy images to the dist folder
gulp.task('images', function () {
  return gulp
    .src(paths.imagesSrc) // Prevent errors if the folder is empty
    .pipe(imagemin({verbose: true}))
    .pipe(gulp.dest(paths.imagesDest))
});

// Copy fonts to the dist folder
gulp.task('fonts', function () {
  return gulp.src(paths.fontsSrc).pipe(gulp.dest(paths.fontsDest));
});

// Serve files with BrowserSync and watch for changes
gulp.task('serve', function () {
  browserSync.init({
    server: './dist',
    open: true,
    notify: false,
  });

  gulp.watch(paths.scss, gulp.series('css')); // Watch SCSS changes
  gulp.watch(paths.htmlSrc, gulp.series('html')).on('change', browserSync.reload); // Reload on HTML changes
  gulp.watch(paths.imagesSrc, gulp.series('images')).on('change', browserSync.reload); // Reload on image changes
  gulp.watch(paths.fontsSrc, gulp.series('fonts')).on('change', browserSync.reload); // Reload on font changes
});

// Default task to build and serve the project
gulp.task('default', gulp.series('css', 'html', 'images', 'fonts', 'serve'));
