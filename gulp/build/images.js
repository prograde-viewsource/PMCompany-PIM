var gulp = require('gulp'),
    config = require('../../gulp.config'),
    imagemin = require('gulp-imagemin'),
    del = require('del');

gulp.task('clean:images-build', function() {
    return del(config.compile + config.appImages);
});

gulp.task('images-build', ['clean:images-build'], function() {
    return gulp
        .src(config.src + config.appImages + '**/*')
        .pipe(imagemin())
        .pipe(gulp.dest(config.build + config.appImages));
});
