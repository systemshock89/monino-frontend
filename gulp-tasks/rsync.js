"use strict";

import { dist, production } from "../gulpfile.js";
import settings from "./_settings.js";

import pkg from 'gulp';
const {src, dest, parallel, series, watch} = pkg;
import rsync from 'gulp-rsync';

// деплоить frontend, компоненты, макеты дизайна, наши наработки
function deployTask() {
    return src([
        './ajax/',
        './classes/',
        './css/',
        './fonts/',
        './form_fmc/',
        './img/',
        './js/',
        './netcat/modules/default/function.inc.php',
        './netcat/editors/ckeditor4/plugins/youtube/',
        './netcat/editors/ckeditor4/plugins/html5video/',
        './netcat/editors/ckeditor4/config.js',
        './netcat_template/class/',
        './netcat_template/template/',
        './favicon.ico',
        './manifest.webmanifest',
    ])
        .pipe(rsync({
            root: './',
            hostname: settings().ssh.site.hostname,
            destination: settings().ssh.site.destination,
            include: [ // Included files to deploy,
                /* '*.htaccess' */
            ],
            exclude: [
                '**/Thumbs.db',
                '**/*.DS_Store',

                '/css/bundle.other.css',
                '/js/app/common.other.js',
                '/js/app/common.other.min.js',

                '/classes/smarty/',
                '/form_fmc/filedata/',
                '/form_fmc/templates_c/',
                '/netcat_template/class/netcat_*/',
                '/netcat_template/class/order/',
                '/netcat_template/class/table/',
                '/netcat_template/class/**/FormPrefix.html',
                '/netcat_template/class/**/RecordTemplate.html',
                '/netcat_template/class/**/FormSuffix.html',
                '/netcat_template/template/**/Header.html',
                '/netcat_template/template/**/Footer.html',
            ],
            recursive: true,
            archive: true,
            silent: false,
            compress: true,
            // clean: true, // Mirror copy with file deletion
            update: true, // Пропускать файлы, которые являются более новыми на принимающей стороне
        }))
}

// деплоить frontend
function deployFrontendTask() {
    return src([
        './css/',
        './fonts/',
        './img/',
        './js/',
        './favicon.ico',
        './manifest.webmanifest',
    ])
        .pipe(rsync({
            root: './',
            hostname: settings().ssh.site.hostname,
            destination: settings().ssh.site.destination,
            include: [
            ],
            exclude: [
                '**/Thumbs.db',
                '**/*.DS_Store',

                '/css/bundle.other.css',
            ],
            recursive: true,
            archive: true,
            silent: false,
            compress: true,
            clean: true,
        }))
}

// деплоить папку netcat_files (закачанные в админке изображения/файлы)
// function deployNetcatFilesTask() {
//     return src('./netcat_files/')
//         .pipe(rsync({
//             root: './',
//             hostname: settings().ssh.site.hostname,
//             destination: settings().ssh.site.destination,
//             include: [
//                 /* '*.htaccess' */
//             ],
//             exclude: [
//                 // '/netcat_files/generated/',
//             ],
//             recursive: true,
//             archive: true,
//             silent: false,
//             compress: true,
//             // clean: true,
//             update: true,
//         }))
// }

// деплоить все (frontend, cmsnc, netcat_files)
function deployAllTask() {
    return src('./')
        .pipe(rsync({
            root: './',
            hostname: settings().ssh.site.hostname,
            destination: settings().ssh.site.destination,
            clean: true,
            include: [
            ],
            exclude: [
                '**/Thumbs.db',
                '**/*.DS_Store',

                // '/netcat_files/generated/',

                '/.git/',
                '/.idea/',
                '/.vscode/',
                '/dist/',
                '/gulp-tasks/',
                '/node_modules/',
                '/src/',
                '/.gitignore',
                '/gulpfile.js',
                '/package.json',
                '/package-lock.json',
                '/readme.md',
                '/test.php',
                '/*.gz',
                '/*.sql',
                '/*.zip',

                // on server
                '/cgi-bin/',
                '/webstat/',
            ],
            recursive: true,
            archive: true,
            silent: false,
            compress: true
        }))
}

// деплоить шаблон верстки в вики
function deployTemplateTask() {
    return src(dist)
        .pipe(rsync({
            root: dist,
            hostname: settings().ssh.template.hostname,
            destination: settings().ssh.template.destination,
            clean: true,
            include: [
            ],
            exclude: [
                '**/Thumbs.db',
                '**/*.DS_Store',
            ],
            recursive: true,
            archive: true,
            silent: false,
            compress: true
        }))
}

export default deployTask;
export {deployTemplateTask, deployAllTask, /*deployNetcatFilesTask,*/ deployFrontendTask};