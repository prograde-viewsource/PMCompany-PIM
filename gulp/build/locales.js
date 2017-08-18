var gulp = require('gulp'),
    config = require('../../gulp.config'),
    del = require('del');

gulp.task('clean:locales-json', function() {
    return del(config.build + config.locales);
});

gulp.task('locales-json', ['clean:locales-json'], function() {
    return gulp
        .src(config.src + config.locales + '**/*.json')
        .pipe(gulp.dest(config.build + config.locales));
});  
 