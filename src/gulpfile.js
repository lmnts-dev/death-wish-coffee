`use strict`;

const gulp = require(`gulp`);
const changed = require(`gulp-changed`);
const compiler = require(`webpack`);
const rename = require(`gulp-rename`);
const webpack = require(`webpack-stream`);
const webpackConfig = require(`../webpack.config.js`)

// Set environment to production
process.env.NODE_ENV = 'production'

/**
 * Asset paths.
 */
const srcCss = `./**/*.css`;
const srcJs = `./**/*.js`;
const srcMainJs = `./js/main.js`;
const srcModulesSnippets = `./modules/**/*.liquid`;
const srcSnippets = `./snippets/**/*.liquid`;
const destSnippets = `../snippets/`;
const destAssets = `../assets`;

/**
 * Build with Webpack
 */
gulp.task(`build`, () => {
  return gulp.src(srcMainJs)
    .pipe(webpack(webpackConfig, compiler))
    .pipe(gulp.dest(destAssets))
});

/**
 * Modules liquid snippets task
 */
gulp.task(`copy-modules-snippets`, () => {
  return gulp.src(srcModulesSnippets)
        .pipe(rename({ dirname: '' }))
        .pipe(changed(destSnippets)) // ignore unchanged files
        .pipe(gulp.dest(destSnippets))
});

/**
 * Snippets task
 */
gulp.task(`copy-snippets`, () => {
  return gulp.src(srcSnippets)
        .pipe(rename({ dirname: '' }))
        .pipe(changed(destSnippets)) // ignore unchanged files
        .pipe(gulp.dest(destSnippets))
});

/**
 * Watch task
 */
gulp.task(`watch`, () => {
    gulp.watch(srcModulesSnippets, gulp.series(`copy-modules-snippets`));
    gulp.watch(srcSnippets, gulp.series(`copy-snippets`));
    gulp.watch([srcCss, srcJs], gulp.series(`build`));
});

/**
 * Default task
 */
gulp.task(`default`, gulp.parallel(`build`, `copy-modules-snippets`, `copy-snippets`));
