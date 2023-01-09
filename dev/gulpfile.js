`use strict`;

const gulp = require(`gulp`);
const changed = require(`gulp-changed`);
const compiler = require(`webpack`);
const concat = require(`gulp-concat`);
const rename = require(`gulp-rename`);
const webpack = require(`webpack-stream`);
const webpackConfig = require(`./webpack.config.js`)

// Set environment to production
process.env.NODE_ENV = 'production'

/**
 * Asset paths.
 */
const srcCss = `./**/*.css`;
const srcJs = `./**/*.js`;
const srcMainJs = `./js/main.js`;
const srcModulesCss = `./modules/**/*.css`;
const srcModulesSnippets = `./modules/**/*.liquid`;
const srcSnippets = `./snippets/**/*.liquid`;
const destAssets = `../assets`;
const destSnippets = `../snippets/`;
const destModulesCss = `./css/modules/`;

/**
 * Build with Webpack
 *
 * Runs the Webpack build to generate the js and css assets.
 */
gulp.task(`build`, () => {
  return gulp.src(srcMainJs)
    .pipe(webpack(webpackConfig, compiler))
    .pipe(gulp.dest(destAssets))
});

/**
 * Modules css task
 *
 * Concatenates all the css files from the modules into a single
 * css file to be included during the Webpack build.
 */
gulp.task(`concat-modules-css`, () => {
  return gulp.src(srcModulesCss)
    .pipe(rename({ dirname: '' }))
    .pipe(concat(`modules.css`))
    .pipe(gulp.dest(destModulesCss))
});


/**
 * Modules liquid snippets task
 *
 * Copies the modules liquid snippets to the top-level snippets folder
 * for Shopify.
 */
gulp.task(`copy-modules-snippets`, () => {
  return gulp.src(srcModulesSnippets)
        .pipe(rename({ dirname: '' }))
        .pipe(changed(destSnippets)) // ignore unchanged files
        .pipe(gulp.dest(destSnippets))
});

/**
 * Snippets task
 *
 *
 * Copies the src snippets to the top-level snippets folder for Shopify.
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
    gulp.watch(srcModulesCss, gulp.series(`concat-modules-css`));
    gulp.watch(srcModulesSnippets, gulp.series(`copy-modules-snippets`));
    gulp.watch(srcSnippets, gulp.series(`copy-snippets`));
    gulp.watch([srcCss, srcJs], gulp.series(`build`));
});

/**
 * Default task
 */
gulp.task(
  `default`,
  gulp.series(
    `concat-modules-css`,
    gulp.parallel(
      `build`,
      `copy-modules-snippets`,
      `copy-snippets`
    )
  )
);
