var gulp = require('gulp'),
    htmlreplace = require('gulp-html-replace');
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    minifyCSS = require('gulp-minify-css'),
    rename = require('gulp-rename'),
    keys = require('./src/keys.js');

// Concatenate and Minify Models into models.min.js
gulp.task('models', function() {
    return gulp.src('./src/js/models/*.js')
        .pipe(concat('models.js'))
        .pipe(gulp.dest('./dist/js'))
        .pipe(rename('models.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js'));
});

// Concatenate and Minify ViewModels into viewmodels.min.js
gulp.task('viewmodels', function() {
    return gulp.src('./src/js/viewmodels/*.js')
        .pipe(concat('viewmodels.js'))
        .pipe(gulp.dest('./dist/js'))
        .pipe(rename('viewmodels.min.js'))
        .pipe(uglify())
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
    .pipe(uglify())
    .pipe(rename(function(path) {
        path.basename += '.min';
        return path;
    }))
    .pipe(gulp.dest('./dist'));
});

// Minify all CSS files
gulp.task('styles', function() {
    gulp.src('./src/**/*.css', '!./src/fonts/*.css')
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
        models: {
            src: 'js',
            tpl: '<script src="%s/models.min.js"></script>'
        },
        vm: 'js/viewmodels.min.js',
        app: 'js/app.min.js',
        keys: 'css/bootstrap-grid.min.css',
        style: 'css/style.min.css'
    }))
    .pipe(gulp.dest('./dist'));
});

// Compress images
gulp.task('images', function() {
    gulp.src(['./src/**/*.+(jpg|png)'])
    .pipe(gulp.dest('./dist'));
});

gulp.task('default', ['models', 'viewmodels', 'lib', 'scripts', 'styles', 'html', 'images']);

