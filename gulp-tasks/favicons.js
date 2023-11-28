"use strict";

import {dist, production} from "../gulpfile.js";

import pkg from 'gulp';
const {src, dest, parallel, series, watch} = pkg;
import gulpFavicons from "gulp-favicons";
import imagemin from "gulp-imagemin";
import changed from "gulp-changed";
import browserSync from "browser-sync";
import {deleteAsync} from "del";

function favicons() {

    // favicon.svg
    src("./src/favicon/favicon.svg", {"allowEmpty": true})
        .pipe(changed(dist + "/img/favicons"))
        .pipe(imagemin())
        .pipe(dest(dist + "/img/favicons"))

    // favicon.ico
    src("./src/favicon/favicon.*")
        .pipe(gulpFavicons({
            icons: {
                favicons: [
                    "favicon.ico"
                ],
                android: false,
                appleIcon: false,
                appleStartup: false,
                firefox: false,
                yandex: false,
                windows: false,
                coast: false
            }
        }))
        .pipe(dest(dist + "/"));

    // android-chrome, apple-touch
    return src("./src/favicon/favicon.*")
        .pipe(gulpFavicons({
            icons: {
                android: [
                    "android-chrome-192x192.png",
                    "android-chrome-512x512.png"
                ],
                appleIcon: [
                    "apple-touch-icon-180x180.png"
                ],
                favicons: false,
                appleStartup: false,
                firefox: false,
                yandex: false,
                windows: false,
                coast: false
            }
        }))
        .pipe(imagemin())
        .pipe(dest(dist + "/img/favicons/"))
        .pipe(browserSync.stream())
        .on('end', async function() {
            // del manifest.json
            await deleteAsync(dist + "/img/favicons/manifest.webmanifest", { force: true });

            // add manifest.webmanifest
            src("./src/manifest.webmanifest")
                .pipe(changed(dist + "/"))
                .pipe(dest(dist + "/"));
        });
}

export default favicons;