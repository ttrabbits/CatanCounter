var gulp = require('gulp');
var ts = require('gulp-typescript');
var sass = require('gulp-sass');

var paths = {
    'ts': 'src/ts/',
    'js': 'js/',
    'scss': 'src/scss/',
    'css': 'css/',
}

gulp.task('compile-ts', function() {
    gulp.src(paths.ts + '*.ts')
        .pipe(ts({
            target: 'ES5',
            removeComments: true,
        }))
        .js
        .pipe(gulp.dest(paths.js))
});

gulp.task('compile-scss', function() {
    gulp.src(paths.scss + '*.scss')
        .pipe(sass({
            outputStyle: 'expanded',
        }))
        .on('error', function(err) {
            console.log(err.message);
        })
        .pipe(gulp.dest(paths.css))
});

gulp.task('watch', function() {
    gulp.watch(paths.ts + '*.ts', ['compile-ts']);
    gulp.watch(paths.scss + '*.scss', ['compile-scss']);
})

gulp.task('default', ['watch']);
