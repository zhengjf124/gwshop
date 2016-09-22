var path = require('path');
var gulp = require('gulp');

require('./gulp')(gulp, {
    "projectName": process.cwd().split(path.sep).pop(), //项目名
    "lazyDir": ["../images"], // gulp-lazyImageCSS 启用目录

    "supportWebp": false, // 开启 WebP 解决方案

    "supportREM": false, // 开启 REM 适配方案，自动转换 px -> rem

    "supportChanged": false, // 开启 只编译有变动的文件

    "reversion": true,  // 开启 新文件名 md5 功能
    "noReversionFile" : ["/html/index.html"] //不进行文件名 md5 文件
});