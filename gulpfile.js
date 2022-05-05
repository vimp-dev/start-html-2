const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const rename = require('gulp-rename');
const autoprefixer = require('gulp-autoprefixer');
const sync = require('browser-sync');
const replace = require('gulp-replace');
const posthtml = require('gulp-posthtml');
const csso = require('gulp-csso');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const webpack = require('webpack-stream');
const webp = require('gulp-webp');
var del = require('del');
const includer = require("gulp-x-includer");

//html
const html = () => {
    // const config = (file) => ({
    //   plugins: [ require('posthtml-include')({ root: file.dirname }) ],
    //   // options: { parser: require('posthtml-sugarml')() }
    // })

    // return gulp.src('./src/pages/**/*.html')
    //     .pipe(posthtml(config))
    //     .pipe(gulp.dest('dist'))
    //     .pipe(sync.stream());

    return gulp.src('./src/pages/**/*.html')
        .pipe(includer())
        .pipe(gulp.dest('dist'))
        .pipe(sync.stream());
}

exports.html = html;

// Styles
const styles = () => {
    return gulp.src('src/styles/**/*.scss')
        .pipe(sass())
        .pipe(rename({ suffix: '.min', prefix : '' }))
        .pipe(autoprefixer({grid: true}))
        // .pipe(replace(/\.\.\//g, ''))
        .pipe(csso())
        .pipe(gulp.dest('dist/css'))
        .pipe(sync.stream());
};

exports.styles = styles;

let modeDev = true;
// Scripts
const scripts = () => {
    return gulp.src('src/js/index.js')
        .pipe(webpack({
            output: {
                filename: 'index.js'
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
            mode: modeDev  ? 'development' : 'production'
        }))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'))
        .pipe(sync.stream());
};

exports.scripts = scripts;

//images
const images = () => {
    return gulp.src('src/img/**/*.{jpg,jpeg,png}')
        .pipe(webp({
            quality: 80
        }))
        .pipe(gulp.dest('dist/img'))
}

exports.images = images;

//copy
const copy = () => {
    return gulp.src([
            'src/fonts/**/*',
            'src/img/**/*',
        ], {
            base: 'src'
        })
        .pipe(gulp.dest('dist'))
        .pipe(sync.stream({
            once: true
        }));
};

exports.copy = copy;

// Server
const server = () => {
    sync.init({
        ui: false,
        notify: false,
        server: {
            baseDir: 'dist'
        }
    });
};

exports.server = server;

//watch
const watch = () => {
    gulp.watch('src/**/*.html', gulp.series(html));
    gulp.watch('src/styles/**/*.scss', gulp.series(styles));
    gulp.watch('src/js/**/*.js', gulp.series(scripts));
    gulp.watch([
        'src/fonts/**/*',
        'src/img/**/*',
    ], gulp.series(copy, images));
}

exports.watch = watch;

//clear
const clear = () => {
    return del(['dist/**', '!dist'], {force:true});
}

exports.clear = clear;

// Default
exports.default = gulp.series(
    gulp.parallel(
        html,
        styles,
        scripts,
        copy,
        images
    ),
    gulp.parallel(
        watch,
        server,
    ),
);

//build
exports.build = gulp.series(
    clear,
    html,
    styles,
    scripts,
    copy,
    images
);
