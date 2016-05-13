var gulp = require('gulp'),
    htmlreplace = require('gulp-html-replace');
    uglify = require('gulp-uglify'),
    minifyCSS = require('gulp-minify-css'),
    rename = require('gulp-rename'),
    keys = require('./src/keys.js');

// Minify all JS files
gulp.task('scripts', function() {
    gulp.src(['./src/**/*.js', '!./src/js/lib/*.js'])
    .pipe(uglify())
    .pipe(rename(function(path) {
        path.basename += '.min';
        return path;
    }))
    .pipe(gulp.dest('./dist'));
});

// Minify all CSS files
gulp.task('styles', function() {
    gulp.src('./src/**/*.css')
    .pipe(minifyCSS())
    .pipe(rename(function(path) {
        path.basename += '.min';
        return path;
    }))
    .pipe(gulp.dest('./dist'));
});

// Minify all HTML files and change links to CSS and JS to use the minified versions
// Inject the GoogleMapsAPI Key to the API url
gulp.task('html', function() {
    gulp.src('./src/**/*.html')
    .pipe(htmlreplace({
        mapsAPI: {
            src: 'https://maps.googleapis.com/maps/api',
            tpl: '<script src="%s/js?key=' + keys.googleMapsKey + '&libraries=places"></script>'
        },
        keys: 'css/bootstrap-grid.min.css',
        style: 'css/style.min.css'
    }))
    .pipe(gulp.dest('./dist'));
});

// Compress images
gulp.task('imagesAndLib', function() {
    gulp.src(['./src/**/*.+(jpg|png)', './src/js/lib/*.js'])
    .pipe(gulp.dest('./dist'));
});

gulp.task('default', ['scripts', 'styles', 'html', 'imagesAndLib']);

