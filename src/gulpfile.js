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
const srcModulesLiquid = `./modules/**/*.liquid`;
const destSnippets = `../snippets/tmp`;
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
  return gulp.src(srcModulesLiquid)
        .pipe(rename({ dirname: '' }))
        .pipe(changed(destSnippets)) // ignore unchanged files
        .pipe(gulp.dest(destSnippets))
});

/**
 * Watch task
 */
gulp.task(`watch`, () => {
    gulp.watch(srcModulesLiquid, gulp.series(`copy-modules-snippets`));
    gulp.watch([srcCss, srcJs], gulp.series(`build`));
});

/**
 * Default task
 */
gulp.task(`default`, gulp.parallel(`build`, `copy-modules-snippets`));
