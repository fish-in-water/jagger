import gulp from 'gulp';
import clean from 'gulp-clean';
import nodemon from 'gulp-nodemon';
import browserSync from 'browser-sync';
import config from '../config';

gulp.task('nodemon', () => {
  nodemon({
    script: './.bin/run.js',
    watch: ['./src'],
    ext: 'js',
    ignore: ['./src/pages/']
  })
    .on('restart', () => {
      setTimeout(() => {
        browserSync.reload({
          stream: false
        });
      }, config.browserSync.reloadDelay + 1000);
    });
});

gulp.task('serve', ['clean:tmp', 'nodemon'], () => {
  browserSync.init({
    proxy: `http://localhost:${config.port}`,
    files: ['./src/pages'],
    port: config.browserSync.port,
    reloadDelay: config.browserSync.reloadDelay,
    open: false,
    notify: config.browserSync.notify,
    socket: {
      clientPath: '/browser-sync'
    }
  });
});
