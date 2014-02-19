var gulp = require('gulp'),
	rename = require('gulp-rename'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify');

var base_path = 'src/';

var target = {
	files : [						// all js files that should not be concatinated
		base_path + 'header.js',
		base_path + 'common.js',
		base_path + 'modules/overview.js',
		base_path + 'modules/main.js',
		base_path + 'modules/barracks.js',
		base_path + 'modules/attackplaner.js',
		base_path + 'modules/map.js',
		base_path + 'modules/attacks.js',
		base_path + 'modules/runtimecalculator.js',
		base_path + 'modules/market.js',
		base_path + 'modules/overviewvillages.js',
		base_path + 'modules/infovillages.js',
		base_path + 'modules/infoplayer.js',
		base_path + 'modules/forum.js',
		base_path + 'modules/messages.js',
		base_path + 'modules/infoally.js',
		base_path + 'css.js',
		base_path + 'matcher.js',
		base_path + 'loca/*',
		base_path + 'i18n.js',
		base_path + 'init.js'
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
