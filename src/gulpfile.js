`use strict`;

const gulp = require(`gulp`);
const changed = require(`gulp-changed`);
const rename = require(`gulp-rename`);

/**
 * Asset paths.
 */
const srcModulesLiquid = `modules/**/*.liquid`;
const destSnippets = `../tmp/snippets`;

/**
 * Modules liquid snippets task
 */
gulp.task(`modules-snippets`, () => {
  return gulp.src(srcModulesLiquid)
        .pipe(rename({ dirname: '' }))
        .pipe(changed(destSnippets)) // ignore unchanged files
        .pipe(gulp.dest(destSnippets))
});

/**
 * Watch task
 */
gulp.task(`watch`, () => {
    gulp.watch(srcModulesLiquid, gulp.series(`modules-snippets`));
});

/**
 * Default task
 */
gulp.task(`default`, gulp.series(`modules-snippets`));
