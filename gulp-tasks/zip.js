"use strict";

import { dist, production } from "../gulpfile.js";

import pkg from 'gulp';
const {src, dest, parallel, series, watch} = pkg;
import gulpZip from "gulp-zip";

function zipTask(){
    return src([
        './**/*',
        './.htaccess',
        './.htpasswd',

        '!./{.git,.git/**/*}',
        '!./{.idea,.idea/**/*}',
        '!./{dist,dist/**/*}',
        '!./{gulp-tasks,gulp-tasks/**/*}',
        '!./{node_modules,node_modules/**/*}',
        '!./{src,src/**/*}',

        '!./.gitignore',
        '!./gulpfile.js',
        '!./package.json',
        '!./package-lock.json',
        '!./test.php',
        '!./readme.md',
        '!./*.gz',
        '!./*.zip',
        '!./*.sql',
    ], {'allowEmpty': true})
        .pipe(gulpZip('archive.zip'))
        .pipe(dest('./'));
}

export default zipTask;