var _ = require('lodash');
var fs = require('fs');
var del = require('del');
var path = require('path');
var ejs = require('gulp-ejs');
var gulpif = require('gulp-if');
var less = require('gulp-less');
var util = require('./lib/util');
var uglify = require('gulp-uglify');
var usemin = require('gulp-usemin2');
var lazyImageCSS = require('gulp-lazyimagecss');  // 自动为图片样式添加 宽/高/background-size 属性
var minifyCSS = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var tmtsprite = require('gulp-tmtsprite');   // 雪碧图合并
var ejshelper = require('tmt-ejs-helper');
var postcss = require('gulp-postcss');  // CSS 预处理
var postcssPxtorem = require('postcss-pxtorem'); // 转换 px 为 rem
var postcssAutoprefixer = require('autoprefixer');
var posthtml = require('gulp-posthtml');
var posthtmlPx2rem = require('posthtml-px2rem');
var RevAll = require('gulp-rev-all');   // reversion
var revDel = require('gulp-rev-delete-original');
var sass = require('gulp-sass');
var csscomb = require('gulp-csscomb');
var htmlmin = require('gulp-htmlmin');
var changed = require('./common/changed')();
var jshint = require('gulp-jshint');
var jscs = require('gulp-jscs');
var htmlhint = require("gulp-htmlhint");
var stylish = require('gulp-jscs-stylish');

var paths = {
    src: {
        dir: './src',
        img: './src/images/**/*.{JPG,jpg,png,gif}',
        slice: './src/slice/**/*.png',
        js: ['./src/js/**/*.js', '!./src/js/**/*.min.js'],
        checkJs: ['./src/js/**/*.js', '!./src/js/**/*.min.js', '!./src/js/gui/**/*.js', '!./src/js/lib/**/*.js'],
        minJs: './src/js/**/*.min.js',
        media: './src/media/**/*',
        less: ['./src/less/*.less', '!./src/less/_*.less'],
        sass: ['./src/sass/*.scss', '!./src/less/_*.less'],
        html: ['./src/html/**/*.html', '!./src/html/_*/**.html'],
        htmlAll: './src/html/**/*',
        php: './src/**/*.php',
        fonts: './src/fonts/**'
    },
    tmp: {
        dir: './tmp',
        css: './tmp/css',
        img: './tmp/images',
        html: './tmp/html',
        sprite: './tmp/images/sprite'
    },
    dist: {
        dir: './dist',
        css: './dist/css',
        img: './dist/images',
        html: './dist/html',
        sprite: './dist/images/sprite'
    }
};

module.exports = function (gulp, config) {
    var webp = require('./common/webp')(config);

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
        ]
    } else {
        postcssOption = [
            postcssAutoprefixer({browsers: ['last 5 versions']})
        ]
    }

    // 清除 dist 目录
    function delDist() {
        return del([paths.dist.dir]);
    }

    // 清除 tmp 目录
    function delTmp() {
        return del([paths.tmp.dir]);
    }

    //编译 less
    function compileLess() {
        return gulp.src(paths.src.less)
            .pipe(less({relativeUrls: true}))
            //.pipe(lazyImageCSS({imagePath: lazyDir}))
            .pipe(tmtsprite({margin: 4}))
            .pipe(gulpif('*.png', gulp.dest(paths.tmp.sprite), gulp.dest(paths.tmp.css)));
    }

    //编译 sass
    function compileSass() {
        return gulp.src(paths.src.sass)
            .pipe(sass())
            .on('error', sass.logError)
            //.pipe(lazyImageCSS({imagePath: lazyDir}))
            .pipe(tmtsprite({
                margin: 4,
                spriteOut: "../images/"
            }))
            .pipe(gulpif('*.png', gulp.dest(paths.tmp.sprite), gulp.dest(paths.tmp.css)));
    }

    //自动补全
    function compileAutoprefixer() {
        return gulp.src('./tmp/css/**/*.css')
            .pipe(postcss(postcssOption))
            .pipe(gulp.dest('./tmp/css/'));
    }
    
    //美化样式
    function beautifyCss() {
        return gulp.src('./tmp/css/**/*.css')
                .pipe(csscomb())
                .pipe(gulp.dest('./tmp/css/'));
    }

    //CSS 压缩
    function miniCSS() {
        return gulp.src('./tmp/css/**/*.css')
            .pipe(minifyCSS({
                safe: true,
                reduceTransforms: false,
                advanced: false,
                compatibility: 'ie7',
                keepSpecialComments: 0
            }))
            .pipe(gulp.dest('./tmp/css/'));
    }

    //图片压缩
    function imageminImg() {
        return gulp.src(paths.src.img)
            .pipe(imagemin({
                use: [pngquant()]
            }))
            .pipe(gulp.dest(paths.tmp.img));
    }

    //复制媒体文件
    function copyMedia() {
        return gulp.src(paths.src.media, {base: paths.src.dir}).pipe(gulp.dest(paths.tmp.dir));
    }
    
    //复制字体库
    function copyFonts() {
        return gulp.src(paths.src.fonts, {base: paths.src.dir}).pipe(gulp.dest(paths.tmp.dir));
    }
    
    //复制项目中使用已压缩过其它js库
    function copyMinJs() {
        return gulp.src(paths.src.minJs, {base: paths.src.dir}).pipe(gulp.dest(paths.tmp.dir));
    }
    
    //检测js潜在错误
    function jsCheck(){
        return gulp.src(paths.src.checkJs, {base: paths.src.dir})
                .pipe(jshint())
                .pipe(jscs())
                .pipe(stylish.combineWithHintResults())
                .pipe(jshint.reporter('jshint-stylish'))
                //.pipe(jshint.reporter('fail'));
    }

    //JS 压缩
    function uglifyJs() {
        return gulp.src(paths.src.js, {base: paths.src.dir})
            .pipe(uglify())
            .pipe(gulp.dest(paths.tmp.dir));
    }

    //雪碧图压缩
    function imageminSprite() {
        return gulp.src('./tmp/images/sprite/**/*')
            .pipe(imagemin({
                use: [pngquant()]
            }))
            .pipe(gulp.dest(paths.tmp.sprite));
    }
    
    //检测html潜在错误
    function htmlHint(){
        return gulp.src(paths.src.html, {base: paths.src.dir})
                .pipe(htmlhint())
                .pipe(htmlhint.reporter("htmlhint-stylish"))
                //.pipe(htmlhint.failReporter());
    }

    //html 编译
    function compileHtml() {
        return gulp.src(paths.src.html)
            .pipe(ejs(ejshelper()))
            .pipe(gulpif(
                config.supportREM,
                posthtml(
                    posthtmlPx2rem({
                        rootValue: 20,
                        minPixelValue: 2
                    })
                ))
            )
            .pipe(usemin({  //JS 合并压缩
                jsmin: uglify()
            }))
            .pipe(htmlmin({
                removeComments: true,
                collapseWhitespace: true
            }))
            .pipe(gulp.dest(paths.tmp.html));
    }

    //webp 编译
    function supportWebp() {
        if (config['supportWebp']) {
            return webp();
        } else {
            return function noWebp(cb) {
                cb();
            }
        }
    }

    //新文件名(md5)
    function reversion(cb) {
        var revAll = new RevAll({
            //debug: true,
            fileNameManifest: 'manifest.json',
            dontRenameFile: config.noReversionFile ? config.noReversionFile : [],
            dontUpdateReference: config.noReversionFile ? config.noReversionFile : []
        });

        if (config['reversion']) {
            return gulp.src(['./tmp/**/*'])
                .pipe(revAll.revision())
                .pipe(gulp.dest(paths.tmp.dir))
                .pipe(revDel({
                    //exclude: /(.html|.htm|.php)$/
                }))
                .pipe(revAll.manifestFile())
                .pipe(gulp.dest(paths.tmp.dir));
        } else {
            cb();
        }
    }

    function findChanged(cb) {

        if (!config['supportChanged']) {
            return gulp.src(['./tmp/**/*', '!./tmp/manifest*.json'], {base: paths.tmp.dir})
                .pipe(gulp.dest(paths.dist.dir))
                .on('end', function () {
                    delTmp();
                })
        } else {
            var diff = changed('./tmp');
            var tmpSrc = [];

            if (!_.isEmpty(diff)) {

                //如果有reversion
                if (config['reversion'] && config['reversion']['available']) {
                    var keys = _.keys(diff);

                    //先取得 reversion 生成的manifest.json
                    var reversionManifest = require(path.resolve('./tmp/manifest.json'));

                    if (reversionManifest) {
                        reversionManifest = _.invert(reversionManifest);

                        reversionManifest = _.pick(reversionManifest, keys);

                        reversionManifest = _.invert(reversionManifest);

                        _.forEach(reversionManifest, function (item, index) {
                            tmpSrc.push('./tmp/' + item);
                            console.log('[changed:] ' + util.colors.blue(index));
                        });

                        //将新的 manifest.json 保存
                        fs.writeFileSync('./tmp/manifest.json', JSON.stringify(reversionManifest));

                        tmpSrc.push('./tmp/manifest.json');
                    }
                } else {
                    _.forEach(diff, function (item, index) {
                        tmpSrc.push('./tmp/' + index);
                        console.log('[changed:] ' + util.colors.blue(index));
                    });
                }

                return gulp.src(tmpSrc, {base: paths.tmp.dir})
                    .pipe(gulp.dest(paths.dist.dir))
                    .on('end', function () {
                        delTmp();
                    })

            } else {
                console.log('Nothing changed!');
                delTmp();
                cb();
            }
        }

    }


    //加载插件
    function loadPlugin(cb) {
        util.loadPlugin(config, 'build_dist');
        cb();
    }

    //注册 build_dist 任务
    gulp.task('dist', gulp.series(
        delDist,
        gulp.parallel(
            compileLess,
            compileSass
        ),
        compileAutoprefixer,
        beautifyCss,
        miniCSS,
        htmlHint,
        jsCheck,
        gulp.parallel(
            imageminImg,
            imageminSprite,
            copyMedia,
            copyFonts,
            copyMinJs,
            uglifyJs
        ),
        compileHtml,
        reversion,
        supportWebp(),
        findChanged,
        loadPlugin
    ));
};

