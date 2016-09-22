var path = require('path');
var del = require('del');
var less = require('gulp-less');
var util = require('./lib/util');
var bs = require('browser-sync').create();  // 自动刷新浏览器
var lazyImageCSS = require('gulp-lazyimagecss');  // 自动为图片样式添加 宽/高/background-size 属性
var postcss = require('gulp-postcss');   // CSS 预处理
var postcssPxtorem = require('postcss-pxtorem'); // 转换 px 为 rem
var postcssAutoprefixer = require('autoprefixer');
var minifyCSS = require('gulp-cssnano');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var rename = require("gulp-rename");
var csscomb = require('gulp-csscomb');

var paths = {
    src: {
        dir: './src',
        img: './src/images/**/*.{JPG,jpg,png,gif}',
        slice: './src/slice/**/*.png',
        js: './src/js/**/*.js',
        media: './src/media/**/*',
        less: ['./src/less/*.less', '!./src/less/_*.less'],
        lessAll: './src/less/**/*.less',
        sass: ['./src/sass/*.scss', '!./src/less/_*.less'],
        sassAll: './src/sass/**/*.scss',
        html: ['./src/html/**/*.html', '!./src/html/_*/**.html', '!./src/html/_*/**/**.html'],
        htmlAll: './src/html/**/*.html',
        php: './src/**/*.php',
        fonts: './src/fonts/**'
    },
    dev: {
        css: './src/css'
    }
};


module.exports = function (gulp, config) {

    var lazyDir = config.lazyDir || ['../images'];

    var postcssOption = [];

    if (config.supportREM) {
        postcssOption = [
            postcssAutoprefixer({browsers: ['last 5 versions']}),
            postcssPxtorem({
                root_value: '20', // 基准值 html{ font-zise: 20px; }
                prop_white_list: [], // 对所有 px 值生效
                minPixelValue: 2 // 忽略 1px 值
            })
        ];
    } else {
        postcssOption = [
            postcssAutoprefixer({browsers: ['last 5 versions']})
        ];
    }

    // 复制操作
    var copyHandler = function (type, file) {
        file = file || paths['src'][type];

        return gulp.src(file, {base: paths.src.dir})
                .pipe(gulp.dest(paths.dev.dir))
                .on('end', reloadHandler);
    };

    // 自动刷新
    var reloadHandler = function () {
        config.livereload && bs.reload();
    };

    //清除目标目录
    function delDev() {
        return del([paths.dev.css]);
    }

    //编译 less
    function compileLess() {
        return gulp.src(paths.src.less)
                .pipe(less({relativeUrls: true}))
                .on('error', function (error) {
                    //console.log(arguments);
                    console.log(error.message);
                })
                .pipe(lazyImageCSS({imagePath: lazyDir}))
                .pipe(gulp.dest(paths.dev.css))
                .on('data', function () {
                    //console.log(arguments);
                })
                .on('end', reloadHandler);
    }

    //编译 sass
    function compileSass() {
        return gulp.src(paths.src.sass)
                .pipe(sourcemaps.init({loadMaps: true}))
                .pipe(sass({
                    errLogToConsole: true,
                    outputStyle: 'expanded'
                }).on('error', sass.logError))
                //.pipe(postcss(postcssOption))
                //.pipe(csscomb())
                //.pipe(lazyImageCSS({imagePath: lazyDir}))
                .pipe(sourcemaps.write(".", {"sourceRoot": "../sass/"}))
                .pipe(gulp.dest(paths.dev.css))
                .on('data', function () {
                    //console.log(arguments);
                })
                .on('end', reloadHandler);
    }

    //自动补全
    function compileAutoprefixer() {
        return gulp.src(paths.dev.css + '/**/*.css')
                .pipe(rename({
                    suffix: '.min'
                }))
                .pipe(postcss(postcssOption))
                .pipe(gulp.dest(paths.dev.css));
    }

    //美化样式
    function beautifyCss() {
        return gulp.src(paths.dev.css + '/**/*.min.css')
                .pipe(csscomb())
                .pipe(gulp.dest(paths.dev.css));
    }

    //CSS 压缩
    function miniCSS() {
        return gulp.src(paths.dev.css + '/**/*.min.css')
                .pipe(minifyCSS({
                    safe: true,
                    reduceTransforms: false,
                    advanced: false,
                    compatibility: 'ie7',
                    keepSpecialComments: 0
                }))
                .pipe(gulp.dest(paths.dev.css));
    }

    var watchHandler = function (type, file) {
        var target = file.match(/^src[\/|\\](.*?)[\/|\\]/)[1];

        switch (target) {
            case 'less':
                compileLess();
                break;
            case 'sass':
                compileSass();
                break;
        }

    };

    //监听文件
    function watch(cb) {
        var watcher = gulp.watch([
            paths.src.lessAll,
            paths.src.sassAll
        ],
                {ignored: /[\/\\]\./}
        );

        watcher
                .on('change', function (file) {
                    util.log(file + ' has been changed');
                    watchHandler('changed', file);
                })
                .on('add', function (file) {
                    util.log(file + ' has been added');
                    watchHandler('add', file);
                })
                .on('unlink', function (file) {
                    util.log(file + ' is deleted');
                    watchHandler('removed', file);
                });

        cb();
    }

    //加载插件
    function loadPlugin(cb) {
        util.loadPlugin(config, 'build_dev');
        cb();
    }

    //注册 build_dev 任务
    gulp.task('dev', gulp.series(
            delDev,
            gulp.parallel(
                    compileLess,
                    compileSass
                    ),
            compileAutoprefixer,
            beautifyCss,
            miniCSS,
            gulp.parallel(
                    watch,
                    loadPlugin
                    )
            ));
};
