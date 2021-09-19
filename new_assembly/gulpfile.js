/**

　　　　　 ,:''"':,　　　　　　,,::''"':,
　　　,:':　,::, ':,　　　 　,:':　;,.　';
　　;':　:'::::';　'; 　　　;'　,':::::.　';
　　;:　:::::::::;　'; 　　 ;'　;':::::::　;'
　　';:　::::::::;　 ;　　 ;:　;'::::::;　;'
　　　;:　':::::::;　 ;　　;:　;'::::::　;'
　　　';:　':;::: 　;,　 ;:.　;'::''　;'
　　　　,,'::　'' 　 :,.,.;':　'' 　,;'
　　,:´::　　　　　　　　 　 ｀'':,
　 　;':::: 　 　 　 　 　 　　　　　':,
　　;::::　　　　　　　　　　　　　    ';
　　';::::　　　O　　　　　　O　　     ;'       
　　';:::＊:. 　 　 　　 　　　　　   ;      
　　'':､::::::.　　　ーー　　,.,::'´ 



    // +------------------------------------+
    // /                                    /
    // /    1. SCSS autocompilation         /
    // /    2. Autoprefixer                 /
    // /    3. CSS minification             /
    // /    4. Concationation files         /
    // /    5. image Webp                   /
    // /    6. Autoreloader                 /
    // /    7. Minification JS              /
    // /                                    /
    // +------------------------------------+

 **/



'use strict'

const   gulp = require('gulp'),
        pug = require('gulp-pug'),
        concat = require('gulp-concat'),
        autoprefixer = require('gulp-autoprefixer'),
        browserSync = require('browser-sync').create(),
            cleanCSS = require('gulp-clean-css'),
            uglify = require('gulp-uglify'),
                del = require('del'),
                sass = require('gulp-sass')(require('sass')),
                imagemin = require('gulp-imagemin'),
            cssFiles = [
'./dev/scss/style.scss',
'./dev/scss/media.scss',
'./dev/scss/vars.scss'
],
            jsFiles = [
'./dev/js/script.js'
];

gulp.task('pug', function() {
    return gulp.src('./dev/pug/*.pug')
        .pipe(pug({
            pretty: true
        }))
        .pipe(gulp.dest('./'))
        .pipe(browserSync.stream())
});

function css() {
    return gulp.src(cssFiles)
        .pipe(concat('style.min.css'))
        .pipe(sass())       
        .pipe(autoprefixer({
            cascade: false
        }))
        .pipe(cleanCSS({
            level: 2 
        }))                         
        .pipe(gulp.dest('./build/css'))
        .pipe(browserSync.stream())
}

gulp.task('sass', function(){
    return gulp.src('./dev/scss/header.scss')
        .pipe(sass())
        .pipe(gulp.dest('build/css'))
});

function js() {
    return gulp.src(jsFiles)
        .pipe(concat('script.min.js'))
        .pipe(uglify({
            toplevel: true
        }))
        .pipe(gulp.dest('./build/js')) 
        .pipe(browserSync.stream())
}

function clean() {
    return del(['./build/css/style.css'])
    return del(['./build/js/script.js'])
}

function images() {
    gulp.src('./dev/img/*')
        .pipe(imagemin())
        .pipe(gulp.dest('./build/img'))
        .pipe(browserSync.stream())
}

function watch() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
    gulp.watch('./dev/scss/**/*.scss', css)
    gulp.watch('./dev/js/**/*.js', js)
    gulp.watch("./*.html").on('change', browserSync.reload);
    gulp.watch('./dev/pug/*.pug', gulp.parallel('pug'));
}   

// gulp.task('watch', function() {
//     gulp.watch('./dev/pug/*.pug', gulp.parallel('pug'));
// });

gulp.task('css', css);
gulp.task('js', js);
gulp.task('del', clean);
gulp.task('watch', watch);
gulp.task('images', images);
gulp.task('build', gulp.series(clean, images, gulp.parallel(css, js)));  
gulp.task('default', gulp.parallel('build', 'watch'));