var gulp = require('gulp'),
    htmlreplace = require('gulp-html-replace');
    uglify = require('gulp-uglify'),
    order = require('gulp-order'),
    concat = require('gulp-concat'),
    cleanCSS = require('gulp-clean-css'),
    rename = require('gulp-rename'),
    htmlmin = require('gulp-htmlmin'),
    sourcemaps = require('gulp-sourcemaps');

// Concatenate and Minify Models into models.min.js
gulp.task('models', function() {
    return gulp.src('./src/js/models/*.js')
        .pipe(order([
            "map-styles.js",
            "yelp-model.js",
            "place-model.js",
            "places-model.js",
            "map-model.js"
        ]))
        .pipe(sourcemaps.init())
        .pipe(concat('models.js'))
        .pipe(rename('models.min.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./dist/js'));
});

// Concatenate and Minify ViewModels into viewmodels.min.js
gulp.task('viewmodels', function() {
    return gulp.src('./src/js/viewmodels/*.js')
        .pipe(sourcemaps.init())
        .pipe(concat('viewmodels.js'))
        .pipe(rename('viewmodels.min.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./dist/js'));
});

// Copy lib JS files as they are
gulp.task('lib', function() {
    gulp.src('./src/js/lib/*.js')
    .pipe(gulp.dest('./dist/js/lib'));
});

// Minify and rename all other JS files except lib files
gulp.task('scripts', function() {
    gulp.src(['./src/**/*.js', '!./src/js/lib/*.js', '!./src/js/models/*.js', '!./src/js/viewmodels/*.js'])
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(rename(function(path) {
        path.basename += '.min';
        return path;
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./dist'));
});

// Minify all CSS files
gulp.task('styles', function() {
    gulp.src(['./src/**/*.css', '!./src/fonts/*.css'])
    .pipe(sourcemaps.init())
    .pipe(cleanCSS({compatibility: 'ie8', processImport: false}))
    .pipe(rename(function(path) {
        path.basename += '.min';
        return path;
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./dist'));
});

// Copy Font files as they are
gulp.task('fonts', function() {
    gulp.src('./src/fonts/*')
    .pipe(gulp.dest('./dist/fonts/'));
});

// Minify all HTML files and change links to CSS and JS to use the minified versions
// Inject the GoogleMapsAPI Key to the API url
gulp.task('html', function() {
    gulp.src('./src/**/*.html')
    .pipe(htmlreplace({
        models: 'js/models.min.js',
        vm: 'js/viewmodels.min.js',
        app: 'js/app.min.js',
        keys: 'keys.min.js',
        styles: 'css/styles.min.css'
    }))
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('./dist'));
});

// Compress images
gulp.task('images', function() {
    gulp.src(['./src/**/*.+(jpg|png)'])
    .pipe(gulp.dest('./dist'));
});

gulp.task('default',
    ['models', 'viewmodels', 'lib', 'scripts', 'styles', 'fonts', 'html', 'images']);