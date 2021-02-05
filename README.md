# 起步

## 1.创建新的packpage.js文件

```
npm init
```

## 2.全局安装gulp

```
npm i -g gulp
```

如果之前已经全局安装过gulp，则只需要把gulp依赖注入到项目中即可

```
npm i gulp --save-dev
```

## 3.安装项目所需要的模块

```
/* gulp-concat  合并文件
* gulp-uglify  压缩js
* gulp-csso    压缩css
* gulp-imagemin    压缩图片
* gulp-clean   清空文件夹
browser-sync 浏览器中的设置
*/
npm i -D gulp-concat gulp-uglify gulp-csso gulp-imagemin gulp-clean
npm i -D browser-sync
/*npm i -D 相当于 npm i--save-dev的简写*/
```

## 4.新建gulpfile.js文件

引入模块

```
var gulp = require('gulp');
var concat = require('gulp-concat');        // 合并文件
var uglify = require('gulp-uglify');        // js 压缩
var csso = require('gulp-csso');            // css压缩
var imagemin = require('gulp-imagemin');    // 图片压缩
var clean = require('gulp-clean');          // 清空文件夹
```

创建项目

```bash
var gulp = require('gulp');
var concat = require('gulp-concat');        // 合并文件
var uglify = require('gulp-uglify');        // js 压缩
var csso = require('gulp-csso');            // css压缩
var imagemin = require('gulp-imagemin');    // 图片压缩
var clean = require('gulp-clean');          // 清空文件夹
var browsers = require('browser-sync').create();  

// html处理
gulp.task('html',async () => {
    await gulp.src('./src/*.html')
        .pipe(gulp.dest('./dist'))
        .on("end",browsers.reload); // 当html文件改变时，浏览器会自动刷新
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
// 监听 监听得文件改变时，会自动执行对应的方法
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

// 浏览器设置 启动项时，浏览器会自动打开
gulp.task('browser',async () =>{
    await browsers.init({
        server:'./dist',
        port:'8080'        
    })
})
gulp.task('default', gulp.series('clean','html','js','css','img','watch','browser',done => {
    done()
}))
```

关于html文件压缩的模块设置：gulp-htmlmin

```
htmlMin = require('gulp-htmlmin') //压缩html
gulp.task('htmlMin', function () {
  var options = {
    removeComments: true, //清除HTML注释
    collapseWhitespace: true, //压缩HTML
    collapseBooleanAttributes: true, //省略布尔属性的值 <input checked="true"/> ==> <input />
    removeEmptyAttributes: true, //删除所有空格作属性值 <input id="" /> ==> <input />
    removeScriptTypeAttributes: true, //删除<script>的type="text/javascript"
    removeStyleLinkTypeAttributes: true, //删除<style>和<link>的type="text/css"
    minifyJS: true, //压缩页面JS
    minifyCSS: true //压缩页面CSS
  };
  return gulp.src(['src/*.html', '!src/include/**.html'])
    .pipe(htmlMin(options))
    .pipe(gulp.dest('dev'))
});
```



webpack和gulp的区别

gulp可以进行js，html，js，css，img的压缩打包，是自动化构建工具，可以将多个js文件或是css压缩成一个文件，并且可以压缩为一行，以此来减少文件的体积，加快请求速度和减少请求次数，并且gulp有task定义处理事务，从而构建整体流程，他是基于流的自动化构建工具

webpack是基于前端的构建工具，实现了模块化开发和文件处理，他的思想就是‘万物皆为模块’，他能够将各个模块按需加载，不会导致加载了 无用或冗余的代码，所以他还有个名字叫做前端模块化打包工具

