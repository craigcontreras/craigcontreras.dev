const gulp = require("gulp");
const tap = require("gulp-tap");
const buffer = require("gulp-buffer");
const browserify = require("browserify");
const uglify = require("gulp-uglify");
const cleanCSS = require("gulp-clean-css");
const sass = require("gulp-sass")(require("sass"));
const sourcemaps = require("gulp-sourcemaps");
const babelify = require("babelify");

gulp.task("sass", function () {
    return gulp.src("src/_includes/sass/*.scss")
        .pipe(sass().on("error", sass.logError))
        .pipe(cleanCSS({
            compatibility : "ie8"
        }))
        .pipe(gulp.dest("src/assets/css"))
});

gulp.task("browserify", function () {
    return gulp.src('src/_includes/unbundled/*.js', { read: false }) // no need of reading file because browserify does.

        // transform file objects using gulp-tap plugin
        .pipe(tap(function (file) {
            // replace file contents with browserify's bundle stream
            file.contents = browserify(file.path, { debug: true }).transform(babelify, {
                presets : ["@babel/preset-env"],
                plugins : [["@babel/plugin-transform-runtime", {
                    regenerator: true
                }]],
                global: true,
                sourceMaps : true
            }).bundle();

        }))

        // transform streaming contents into buffer contents (because gulp-sourcemaps does not support streaming contents)
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(uglify())
        .pipe(sourcemaps.write("./"))
        .pipe(gulp.dest("src/assets/js"));
});



exports.default = gulp.series(["browserify", "sass"]);