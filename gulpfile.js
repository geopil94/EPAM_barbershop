"use strict";
 
var gulp = require("gulp");
var sass = require("gulp-sass");
 
gulp.task("sass", function () {
  gulp.src("./assets/**/*.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(gulp.dest("./"))
});
 
gulp.task("sass:watch", function () {
  gulp.watch("./assets/**/*.scss", ["sass"]);
});

var autoprefixer = require("gulp-autoprefixer");
 
gulp.task("prefix", function () {
    return gulp.src("index.css")
        .pipe(autoprefixer({
            browsers: ["last 2 versions"],
            cascade: false
        }))
        .pipe(gulp.dest("./"));
});