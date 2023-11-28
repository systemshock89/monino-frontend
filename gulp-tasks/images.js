"use strict";

import { dist, production } from "../gulpfile.js";

import pkg from 'gulp';
const {src, dest, parallel, series, watch} = pkg;
import changed from "gulp-changed";
import imagemin from "gulp-imagemin";
import webp from "gulp-webp";
import browserSync from "browser-sync";

function images() {

    // изображения из папки img_nocompress перемещаем в img БЕЗ сжатия и конвертации
    src("./src/img_nocompress/**/*")
        .pipe(changed(dist + "/img"))
        .pipe(dest(dist + "/img"))
        .pipe(browserSync.stream());

    // svg compress
    src('./src/img/**/*.svg')
        .pipe(changed(dist + "/img"))
        .pipe(imagemin())
        .pipe(dest(dist + "/img"))
        .pipe(browserSync.stream());

    // изображения из папки img (кроме svg) конвертируем в webp и сжимаем
    return src(['./src/img/**/*', `!./src/img/**/*.svg`])
        .pipe(changed(dist + "/img", {extension: '.webp'}))
        .pipe(webp({
            // imagemin-webp https://github.com/imagemin/imagemin-webp#imageminwebpoptions
            quality: 90,
        }))
        .pipe(dest(dist + "/img"))
        .pipe(browserSync.stream());
}

export default images;