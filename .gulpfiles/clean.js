import gulp from 'gulp';
import clean from 'gulp-clean';

gulp.task('clean:tmp', () => {
  return gulp.src(['./.tmp'], { read: false })
    .pipe(clean({ force: true }));
});

gulp.task('clean:dest', () => {
  return gulp.src(['./dest'], { read: false })
    .pipe(clean({ force: true }));
});

gulp.task('clean', ['clean:tmp', 'clean:dest']);

