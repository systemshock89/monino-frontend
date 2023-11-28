"use strict";

import { dist, production } from "../gulpfile.js";

const {src, dest, parallel, series, watch} = pkg;
import pkg from 'gulp';
import webpackStream from "webpack-stream";
import webpack from "webpack";
import browserSync from "browser-sync";
import uglify from 'gulp-uglify';
import rename from "gulp-rename";
import replace from "gulp-replace";
import gulpif from "gulp-if";
import sourcemaps from "gulp-sourcemaps";

function scriptsModule() {
    return src("./src/js/bundle.js")
        .pipe(webpackStream({
            mode: production ? "production" : "development",
            output: {
                filename: 'bundle.min.js'
            },
            watch: false,
            devtool: production ? false : "source-map",
            module: {
                // правила для babel
                rules: [
                    {
                        test: /\.m?js$/, // находим файлы js
                        exclude: /(node_modules|bower_components)/, // исключаем папки
                        use: {
                            loader: 'babel-loader', // свяжет webpack и babel
                            options: {
                                presets: [['@babel/preset-env', {
                                    debug: production ? false : true, // показывает инф-ю во время компиляции
                                    corejs: 3, // биб-ка corejs 3-й версии (для полифилов)
                                    useBuiltIns: "usage" // позволяет corejs выбрать только те полифилы, кот-е нужны в проекте
                                }]]
                            }
                        }
                    }
                ]
            }
        }, webpack)).on('error', (err) => {
            this.emit('end');
        })
        .pipe(dest(dist + '/js'))
        .pipe(browserSync.stream());
}

function scriptsApp() {
    return src("./src/js/app/**/*")
        .pipe(gulpif(production, sourcemaps.init()))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulpif(production, uglify()))
        .pipe(gulpif(production, sourcemaps.write("./maps/")))
        .pipe(dest(dist + '/js/app'))
        .pipe(browserSync.stream());
}

const scripts = parallel(scriptsModule, scriptsApp);

export default scripts;