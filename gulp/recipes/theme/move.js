var gulp         = require('gulp');
var plumber      = require('gulp-plumber');
var add          = require('gulp-add');
var gulpif       = require('gulp-if');
var filter       = require('gulp-filter');
var insert       = require('gulp-insert');
var changed      = require('gulp-changed');
var notify       = require('gulp-notify');
var yargs        = require('yargs');
var displayError = require('../../utils/displayError');
var pumped       = require('../../utils/pumped');
var style        = require('../../config/wp.style');
var bSSnippet    = require('../../config/browser-sync.snippet');
var project      = require('../../../package.json');


/**
 * Move the Theme to
 * the build directory
 *
 * @returns {*}
 */
module.exports = function () {
	var filterFunc = filter('functions.php');

	return gulp.src(['theme/**/*', '!theme/README.md'], { base: 'theme' })
		.pipe(plumber({ errorHandler: displayError }))

		.pipe(add({
			'.gitignore': '*',
			'style.css': style
		}))

		.pipe(gulpif(!yargs.argv.build, filterFunc))
		.pipe(gulpif(!yargs.argv.build, insert.append(bSSnippet)))
		.pipe(gulpif(!yargs.argv.build, filterFunc.restore()))

		.pipe(changed('../' + project.name, { hasChanged: changed.compareSha1Digest }))

		.pipe(gulp.dest('../' + project.name))
		.pipe(notify({
			message: pumped('Theme Moved!'),
			onLast: true
		}));
};