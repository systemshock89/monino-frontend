"use strict";

import { dist, production } from "../gulpfile.js";

const {src, dest, parallel, series, watch} = pkg;
import pkg from 'gulp';
import changed from "gulp-changed";

function cms() {
    return src([`${dist}/**/*`, `!${dist}/*.html`, `!${dist}/{forms,forms/**/*}`])
        .pipe(changed("./"))
        .pipe(dest("./"));
}

export default cms;