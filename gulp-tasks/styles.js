"use strict";

import { dist, production } from "../gulpfile.js";

import pkg from 'gulp';
const {src, dest, parallel, series, watch} = pkg;
import gulpSass from 'gulp-sass';
// import dartSass from 'sass';
import * as dartSass from 'sass';
const sass = gulpSass(dartSass);
import gulpif from "gulp-if";
import sourcemaps from "gulp-sourcemaps";
import postCss from "gulp-postcss";
import postcssSortMediaQueries from "postcss-sort-media-queries";
import postcssPathReplace from "postcss-path-replace";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";
import rename from "gulp-rename";
import browserSync from "browser-sync";
import replace from "gulp-replace";
import injectCSS from "gulp-inject-css";
import {deleteAsync} from "del";

function stylesMain() {

    // critical.css
    src("./src/scss/critical.scss")
        .pipe(gulpif(!production, sourcemaps.init()))
        .pipe(sass().on('error', sass.logError))
        .pipe(gulpif(production, postCss([
            postcssPathReplace({
                publicPath: "img/",
                matched: "../img/",
                mode: "replace"
            }),
            postcssSortMediaQueries({sort: 'desktop-first'}),
            autoprefixer({ grid: 'autoplace' }),
            cssnano({ preset: ['default', { discardComments: { removeAll: true } }] })
        ])))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulpif(!production, sourcemaps.write("./maps/")))
        .pipe(dest(dist + '/css'))
        .pipe(browserSync.stream());

    // other styles
    // src(["./src/scss/main.admin.scss", "./src/scss/main.edit.scss"])
    //     .pipe(gulpif(!production, sourcemaps.init()))
    //     .pipe(sass().on('error', sass.logError))
    //     .pipe(gulpif(production, postCss([
    //         postcssSortMediaQueries({sort: 'desktop-first'}),
    //         autoprefixer({ grid: 'autoplace' }),
    //         cssnano({ preset: ['default', { discardComments: { removeAll: true } }] })
    //     ])))
    //     .pipe(rename(function(path) {
    //         if (path.basename === 'main.admin') {
    //             path.basename = 'bundle.admin';
    //             path.suffix = '.min';
    //         } else if (path.basename === 'main.edit') {
    //             path.basename = 'bundle.edit';
    //             path.suffix = '.min';
    //         }
    //     }))
    //     .pipe(gulpif(!production, sourcemaps.write("./maps/")))
    //     .pipe(dest(dist + '/css'))
    //     .pipe(browserSync.stream());

    // bundle.css
    return src("./src/scss/main.scss")
        .pipe(gulpif(!production, sourcemaps.init()))
        .pipe(sass().on('error', sass.logError))
        .pipe(gulpif(production, postCss([
            postcssSortMediaQueries({sort: 'desktop-first'}),
            autoprefixer({ grid: 'autoplace' }),
            cssnano({ preset: ['default', { discardComments: { removeAll: true } }] })
        ])))
        .pipe(rename({
            basename: 'bundle',
            suffix: '.min'
        }))
        .pipe(gulpif(!production, sourcemaps.write("./maps/")))
        .pipe(dest(dist + '/css'))
        .pipe(browserSync.stream());
}

function replaceCriticalCSSLink() {
    if(production){
        src('./netcat_template/template/main/partials/critical.html')
            .pipe(replace('<link rel="stylesheet" href="css/critical.min.css?ver=1.0.0">', '<!-- inject-css css/critical.min.css -->'))
            .pipe(dest('./netcat_template/template/main/partials'));

        // для injectCSS кладем critical.min.css в /netcat_template/template/main/partials/css
        src(dist + '/css/critical.min.css')
            .pipe(dest('./netcat_template/template/main/partials/css'));

        return src(dist + '/*.html')
            .pipe(replace('<link rel="stylesheet" href="css/critical.min.css?ver=1.0.0">', '<!-- inject-css css/critical.min.css -->'))
            .pipe(dest(dist));
    } else {
        return src('./netcat_template/template/main/partials/critical.html')
            .pipe(replace(/.+/gs, '<link rel="stylesheet" href="css/critical.min.css?ver=1.0.0">'))
            .pipe(dest('./netcat_template/template/main/partials'));

        // return src('./src/critical.html')
        //     .pipe(dest('./netcat_template/template/main/partials'));
    }
}

function injectCriticalCSS() {
    src('./netcat_template/template/main/partials/critical.html')
        .pipe(injectCSS())
        .pipe(dest('./netcat_template/template/main/partials'));

    return src(dist + '/*.html')
        .pipe(injectCSS())
        .pipe(dest(dist))
        .on('end', async function() {
            await deleteAsync('./netcat_template/template/main/partials/css/', { force: true });
        });
}

const styles = series(stylesMain /*, replaceCriticalCSSLink*/);

export default styles;
export {injectCriticalCSS};