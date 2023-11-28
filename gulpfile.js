"use strict";

import settings from "./gulp-tasks/_settings.js";

const proxy = settings().proxy;
export const dist = "./dist";

export let production;
async function isProd() {
    production = true;
}

import pkg from 'gulp';
const {src, dest, parallel, series, watch} = pkg;
import {deleteAsync} from 'del';

import concat from 'gulp-concat';
import debug from "gulp-debug";

import scripts from './gulp-tasks/scripts.js';
import styles, {injectCriticalCSS} from './gulp-tasks/styles.js';
import images from "./gulp-tasks/images.js";
import sprites from "./gulp-tasks/sprites.js";
import favicons from "./gulp-tasks/favicons.js";
import html from "./gulp-tasks/html.js";
import copyAssets from "./gulp-tasks/assets.js";
import cms from './gulp-tasks/cms.js';
import serve from "./gulp-tasks/serve.js";
import ftpSite, {ftpCmsTask, ftpWikiTask} from './gulp-tasks/ftp.js';
import deployTask, {deployAllTask, /*deployNetcatFilesTask,*/ deployTemplateTask, deployFrontendTask} from './gulp-tasks/rsync.js';
import zipTask from "./gulp-tasks/zip.js";

async function clearDistTask() {
    await deleteAsync(dist, { force: true });
}

async function clearProdTask() {
    await deleteAsync(['./css', './js', './fonts', './img', './js', "./favicon.ico", "./manifest.webmanifest"], { force: true });
}

export const clearDist = clearDistTask;
export const clearProd = clearProdTask;
export const deploy = deployTask;
export const deployTemplate = deployTemplateTask;
export const deployAll = deployAllTask;
// export const deployNetcatFiles = deployNetcatFilesTask;
export const deployFrontend = deployFrontendTask;
export const ftp = ftpSite;
export const ftpCms = ftpCmsTask;
export const ftpWiki = ftpWikiTask;
export const img = images;
export const zip = zipTask;
export const build = parallel(html, styles, scripts, copyAssets, favicons, sprites, images);
export const prod = series(isProd, parallel(clearDist, clearProd), build, /*injectCriticalCSS, cms */);
export default (!proxy ? series(build, serve) : series(build, /* cms, */ serve));