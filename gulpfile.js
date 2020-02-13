var syntax        = 'sass'; // Syntax: sass or scss;

var gulp          = require('gulp'),
		gutil         = require('gulp-util'),
		sass          = require('gulp-sass'),
		browserSync   = require('browser-sync'),
		concat        = require('gulp-concat'),
		uglify        = require('gulp-uglify'),
		cleancss      = require('gulp-clean-css'),
		rename        = require('gulp-rename'),
		autoprefixer  = require('gulp-autoprefixer'),
		notify        = require("gulp-notify"),
		webpack       = require('webpack-stream'),
		webp           = require('webpack'),
		nunjucksRender = require('gulp-nunjucks-render'),
		imagemin      = require('gulp-imagemin'),
		gulpif        = require('gulp-if');


gulp.task('browser-sync', async function() {
	browserSync({
		server: {
			baseDir: 'build'
		},
		notify: false,
		// open: false,
		// online: false, // Work Offline Without Internet Connection
		// tunnel: true, tunnel: "projectname", // Demonstration page: http://projectname.localtunnel.me
	});
});


gulp.task('styles', async function() {
	return gulp.src('src/'+syntax+'/**/*.'+syntax+'')
	.pipe(sass({ outputStyle: 'expand' }).on("error", notify.onError()))
	.pipe(rename({ suffix: '.min', prefix : '' }))
	.pipe(autoprefixer(['last 15 versions']))
	.pipe(cleancss( {level: { 1: { specialComments: 0 } } })) // Opt., comment out when debugging
	.pipe(gulp.dest('build/css'))
	.pipe(browserSync.stream());
});

let modeDev = true;
let modeProd = !modeDev;

gulp.task('js', async function() {
	return gulp.src('./src/js/index.js')
	.pipe(webpack({
		output: {
			filename: 'bundle.min.js'
		},
		module: {
			rules: [
				{
					test: /\.js$/,
					exclude: /node_modules/,
					loader: 'babel-loader',
				}
			]
		},
		plugins: [
			new webp.ProvidePlugin({
				$: 'jquery',
				jQuery: 'jquery',
				'window.jQuery': 'jquery',
			}),
		],
		mode: modeDev  ? 'development' : 'production'
	}))
	.pipe(gulp.dest('./build/js'))
	.pipe(browserSync.reload({ stream: true }));
});

gulp.task('html', async function(){
	return gulp.src('./src/templates/*.html')
	.pipe(nunjucksRender({
		path: ['./src/templates'], // String or Array
		envOptions: {
			watch: false,
			trimBlocks: true,
			lstripBlocks: false
		},
	  }))
	.pipe(gulp.dest('build/'))
	.pipe(browserSync.reload({ stream: true }));
})

gulp.task('image', async function(){
	return gulp.src('./src/img/**/*')
	.pipe(gulpif(modeProd, imagemin()))
	.pipe(gulp.dest('build/img'))
});

gulp.task('img', gulp.parallel('image'));

gulp.task('watch', async function() {
	gulp.watch('./src/'+syntax+'/**/*.'+syntax+'', gulp.parallel('styles'));
	gulp.watch(['./src/js/**/*.js'], gulp.parallel('js'));
	gulp.watch(['./src/img/**/*'], gulp.parallel('img'));
	gulp.watch(['./src/templates/**/*.html'], gulp.parallel(['html', 'img'])).on('change', browserSync.reload);
});

gulp.task('build', gulp.parallel('img', 'styles', 'js', 'html'));
gulp.task('default', gulp.parallel('img', 'watch', 'html', 'styles', 'js', 'browser-sync'));
