'use strict';
	
	var gulp = require('gulp'),
		webserver = require('gulp-webserver'),
		sass = require('gulp-sass'),
		concat = require('gulp-concat'),
		csso = require('gulp-csso');

var bc = './bower_components/';
	
	gulp.task('js', function() {
	  gulp.src('dev/js/*.js')
		.pipe(concat('main.js'))
		.pipe(gulp.dest('live/js/'))
	});
	
	gulp.task('html', function() {
		gulp.src('dev/**/*.html')
		.pipe(gulp.dest('live/'))
	});
	
	gulp.task('css', function () {
		gulp.src('dev/css/*')
		.pipe(csso())
		.pipe(gulp.dest('live/css/'));
	});
	
	gulp.task('img', function() {
	  gulp.src('dev/img/*')
		.pipe(gulp.dest('live/img/'));
	});
	
	gulp.task('watch', function() {
		gulp.watch('dev/js/*.js', ['js']);
		gulp.watch('dev/*.html', ['html']);
		gulp.watch('dev/css/*.css', ['css']);
	});
	
	gulp.task('libs', function() {
		gulp.src(bc+'jquery/dist/jquery.js')
		.pipe(gulp.dest('./live/libs/jquery/'));
		
		gulp.src(bc+'bootstrap/dist/**/*.*')
		.pipe(gulp.dest('./live/libs/bootstrap/'));
		
		gulp.src(bc+'bootstrap-material-design/dist/**/*.*')
		.pipe(gulp.dest('./live/libs/bootstrap-material-design/'));
		
	});
	
	gulp.task('webserver', function() {
		gulp.src('live/')
			.pipe(webserver({
			livereload: true,
			open: true
		}));
	});
	
	gulp.task('default', [
		'libs',
		'html',
		'css',
		'js',
		'webserver',
		'watch'
	]);