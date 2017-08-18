var gulp = require('gulp'),
    config = require('../../gulp.config'),
    del = require('del');

gulp.task('clean:locales', function() {
    return del(config.compile + config.locales);
});

gulp.task('locales', ['clean:locales'], function() {
    return gulp
        .src(config.src + config.locales + '**/*.json')
        .pipe(gulp.dest(config.compile + config.locales));
});  
 