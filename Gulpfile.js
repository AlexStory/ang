var gulp = require("gulp"),
  webserver = require("gulp-webserver"),
  sass = require("gulp-sass"),
  concat = require("gulp-concat");

gulp.task("sass", function() {
  gulp.src("css/*.sass")
    .pipe(sass({
      sourceComments: "normal"
    }))
    .on("error", console.log)
    .pipe(concat("css/main.css"))
    .pipe(gulp.dest("."));
});

gulp.task("default", [ "sass" ], function() {
  console.log("Gulp is running");
  gulp.src("./")
    .pipe(webserver());
  gulp.watch("css/*.sass", [ "sass" ])
});
