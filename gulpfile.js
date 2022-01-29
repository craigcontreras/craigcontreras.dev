const gulp = require("gulp");
const tap = require("gulp-tap");
const buffer = require("gulp-buffer");
const browserify = require("browserify");

function buildScripts() {
    return gulp.src('src/_includes/unbundled/*.js', { read: false }) // no need of reading file because browserify does.

        // transform file objects using gulp-tap plugin
        .pipe(tap(function (file) {
            // replace file contents with browserify's bundle stream
            file.contents = browserify(file.path, {
                plugin: [
                    [
                        require('esmify')
                    ]
                ],
                debug: true 
            }).bundle();

        }))

        // transform streaming contents into buffer contents (because gulp-sourcemaps does not support streaming contents)
        .pipe(gulp.dest("src/assets/js"))
        .pipe(buffer());
}

exports.default = buildScripts;