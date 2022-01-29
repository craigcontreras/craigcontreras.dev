const gulp = require("gulp");
const tap = require("gulp-tap");
const buffer = require("gulp-buffer");
const browserify = require("browserify");
const sass = require("gulp-sass")(require("sass"));

gulp.task("sass", function () {
    return gulp.src("src/_includes/sass/*.scss")
        .pipe(sass().on("error", sass.logError))
        .pipe(gulp.dest("src/assets/css"))
});

gulp.task("browserify", function () {
    return gulp.src('src/_includes/unbundled/*.js', { read: false }) // no need of reading file because browserify does.

        // transform file objects using gulp-tap plugin
        .pipe(tap(function (file) {
            // replace file contents with browserify's bundle stream
            file.contents = browserify(file.path, {
                plugin: [
                    [
                        require("esmify")
                    ]
                ],
                debug: true 
            }).bundle();

        }))

        // transform streaming contents into buffer contents (because gulp-sourcemaps does not support streaming contents)
        .pipe(gulp.dest("src/assets/js"))
        .pipe(buffer());
});

exports.default = gulp.series(["browserify", "sass"]);