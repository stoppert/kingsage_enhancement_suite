var gulp = require('gulp'),
	rename = require('gulp-rename'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify');

var base_path = 'src/';

var target = {
	files : [						// all js files that should not be concatinated
		base_path + 'header.js',
		base_path + 'loca/*',
		base_path + 'i18n.js',
		base_path + 'init.js',
		base_path + 'jquery-kes.js',
		base_path + 'helpers.js',
		base_path + 'common.js',
		base_path + 'apply-settings.js',
		base_path + 'check-version.js',
		base_path + 'modules/*',
		base_path + 'css.js',
		base_path + 'matcher.js',
	],
	dest : 'dist/',					// where to put minified js
	name : 'kingsage_enhancement_sui.user.js'
};

gulp.task('js', function() {
	return gulp.src(target.files)
		.pipe(concat(target.name))
	/*	.pipe(uglify({ 
			global_defs: { 
				DEBUG: false 
			},
		}))*/
		.pipe(gulp.dest(target.dest));
});

gulp.task('copy', function() {
	return gulp.src(target.dest + target.name)
		.pipe(gulp.dest('E:\\Firefox\\apple-sauce\\gm_scripts\\Kingsage_Enhancement_Suite'));
});

gulp.task('make', ['js'], function() {
	gulp.start('copy');
});

gulp.task('default', function() {
	gulp.watch(base_path, ['js', 'copy']);
});
