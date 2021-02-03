var gulp = require('gulp');
var concat = require('gulp-concat');        // 合并文件
var uglify = require('gulp-uglify');        // js 压缩
var csso = require('gulp-csso');            // css压缩
var imagemin = require('gulp-imagemin');    // 图片压缩
var clean = require('gulp-clean');          // 清空文件夹
var browsers = require('browser-sync').create();  
var fs = require('fs')
// var runSequence = require('run-sequence') 旧版的gulp顺序执行

var env = 'dev' //用于执行gulp任务时得判断
function set_env(type){ 
    env = type || 'dev';
    // 生成env.js文件，用于开发页面时，判断环境
    fs.writeFile("./env.js", `function(){return ${type}}`, function(err){
        err && console.log(err);
    });
}
// gulp.task('setEnv',set_env)
// html处理
gulp.task('html',async () => {
    await gulp.src('./src/*.html')
        .pipe(gulp.dest('./dist'))
        .on("end",browsers.reload);
})
// js文件压缩
gulp.task('js', async () => {
    await gulp.src('./src/js/*.js')
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js'))
        .on("end",browsers.reload);
})
// css文件压缩
gulp.task('css', async () => {
    await gulp.src('./src/css/*.css')
        .pipe(concat('main.min.css'))
        .pipe(csso())
        .pipe(gulp.dest('./dist/css'))
        .on("end",browsers.reload);
})
// 图片
gulp.task('img', async () => {
    await gulp.src('./src/images/*.*')
        .pipe(imagemin())
        .pipe(gulp.dest('./dist/images'))
})
// 监听
gulp.task('watch', async () => {
    await gulp.watch('./src/*.html',gulp.series('html'))
         gulp.watch('./src/css/*.css',gulp.series('css'))
         gulp.watch('./src/js/*.js',gulp.series('js'))
         gulp.watch('./src/images/*.*',gulp.series('img'))
})
// 清空dist文件
gulp.task('clean', () => {
    return gulp.src(['./dist/*']).pipe(clean())
})

// 浏览器设置
gulp.task('browser',async () =>{
    await browsers.init({
        server:'./dist',
        port:'8080'
        // {
        //     baseDir: "./dist",
        //     index: "index.html"
        // }, // 访问目录
        // proxy:'localhost:8080', // 设置代理
        // reqHeaders: function (config) {//使用自定义请求头
        //     return {
        //         "host":            config.urlObj.host,
        //         "accept-encoding": "identity",
        //         "agent":           false
        //     }
        // }
        
    })
})
gulp.task('default', gulp.series('clean','html','js','css','img','watch','browser',done => {
    done()
}))
// gulp.task('dev', gulp.series('clean',done => {
//     set_env('dev')
//     gulp.series('html','js','css','img','watch','browser')
//     done()
// }))
// gulp.task('build', gulp.series('setEnv','clean','html','js','css','img',done => {
//     done()
// }))