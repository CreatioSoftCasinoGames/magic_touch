var gulp                 = require('gulp');
var concat             = require('gulp-concat');
var ngAnnotate     = require('gulp-ng-annotate');
var plumber         = require('gulp-plumber');
var uglify             = require('gulp-uglify');
var bytediff         = require('gulp-bytediff');
var rename             = require('gulp-rename');

gulp.task('app', function() {
	return gulp.src(['./js/main.js', './js/directives.js', './js/**/*.js'])
		.pipe(plumber())
			.pipe(concat('app.js', {newLine: ';'}))
			.pipe(ngAnnotate({add: true}))
		.pipe(plumber.stop())
	  .pipe(gulp.dest('./'));
});

gulp.task('prod', function() {
	return gulp.src('app.js')
		.pipe(plumber())
		.pipe(bytediff.start())
		.pipe(uglify({mangle: true}))
		.pipe(bytediff.stop())
		.pipe(rename('app.min.js'))
		.pipe(plumber.stop())
	.pipe(gulp.dest('./'));
});

// gulp.task('watch', ['prod'], function () {
// 	console.log("gulp is working")
// 	// return gulp.watch('./**/*.js', ['prod']);
// });

// gulp.task('default', ['app']);
gulp.task('default', ['prod']);