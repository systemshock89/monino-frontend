"use strict";

import { dist, production } from "../gulpfile.js";
import settings from "./_settings.js";

import pkg from 'gulp';
const {src, dest, parallel, series, watch} = pkg;
import vinylFtp from "vinyl-ftp";

function ftpSite() {

    const conn = vinylFtp.create({
        host: settings().ftp.site.host,
        user: settings().ftp.site.user,
        password: settings().ftp.site.pass,
        parallel: 10,
    });

    const globs  = [
        'css/**',
        '!css/common.other.css',
        'fonts/**',
        'img/**',
        'js/**',
        '!js/app/common.other.js',
        'favicon.ico',
        'manifest.webmanifest',

        'netcat_template/template/main/partials/critical.html'
    ];

    return src(globs, { base: '.', buffer: false })
        .pipe(conn.newer(settings().ftp.site.folderPath) ) // only upload newer files
        .pipe(conn.dest(settings().ftp.site.folderPath) );
}

function ftpCmsTask(done) {

    const conn = vinylFtp.create({
        host: settings().ftp.cmsnc.host,
        user: settings().ftp.cmsnc.user,
        password: settings().ftp.cmsnc.pass,
        parallel: 10,
    });

    const folderPath = settings().ftp.cmsnc.folderPath;

    const globs = [
        'css/**',
        '!css/common.other.css',
        'fonts/**',
        'img/**',
        'js/**',
        '!js/app/common.other.js',
        'favicon.ico',
        'manifest.webmanifest',

        'netcat_template/template/main/partials/critical.html'
    ];

    conn.rmdir( folderPath + '/css/*', function () {
        conn.rmdir( folderPath + '/fonts/*', function () {
            conn.rmdir( folderPath + '/img/*', function () {
                conn.rmdir( folderPath + '/js/*', function () { // если кто-то пишет файлы js, то не удаляем папку c js, чтоб не затереть его работу
                    conn.delete( folderPath + '/favicon.ico', function () {
                        conn.delete( folderPath + '/manifest.webmanifest', function () {
                            return src( globs, { base: '.', buffer: false } )
                                .pipe(conn.dest(folderPath));
                        });
                    });
                });
            });
        });
    });

    done();
}

function ftpWikiTask(done) {

    const conn = vinylFtp.create({
        host: settings().ftp.wiki.host,
        user: settings().ftp.wiki.user,
        password: settings().ftp.wiki.pass,
        parallel: 10,
    });

    const folderPath = settings().ftp.wiki.folderPath;

    const globs = [
        'dist/**',
    ];

    conn.rmdir( folderPath + '/*', function () {
        return src(globs, {base: '.', buffer: false})
            .pipe(conn.dest(folderPath));
    });

    done();
}

export default ftpSite;
export {ftpCmsTask, ftpWikiTask};
