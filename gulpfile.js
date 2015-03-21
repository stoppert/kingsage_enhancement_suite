var gulp = require('gulp'),
	gulpif = require('gulp-if');
	rename = require('gulp-rename'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify');
	markdown = require('gulp-markdown');

var base_path = 'src/';

var js = {
	isHeader: function(file) {
		return file.path.indexOf('header.js') == -1;
	},
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

var md = {
	files: [
		'docs/*/*'
	],
	dest: 'dist/docs/'
}

gulp.task('markdown', function() {
	return gulp.src(md.files)
		.pipe(markdown())
		.pipe(gulp.dest(md.dest));
});

gulp.task('js', function() {
	return gulp.src(js.files)
		.pipe(gulpif(js.isHeader, uglify({ mangle: false })))
		.pipe(concat(js.name))
		/*.pipe(concat(js.name))
		.pipe(uglify({ 
			global_defs: { 
				DEBUG: true 
			},
		}))*/
		.pipe(gulp.dest(js.dest));
});

gulp.task('copy', function() {
	return gulp.src(js.dest + js.name)
		.pipe(gulp.dest('/Users/marc/Library/Application Support/Firefox/Profiles/yzbnre08.default/gm_scripts/Kingsage_Enhancement_Suite'));
});

gulp.task('make', ['js'], function() {
	gulp.start('copy');
});

gulp.task('default', function() {
	gulp.watch(base_path, ['js', 'copy']);
});
