import gulp from 'gulp';
import concat from 'gulp-concat';
import sequence from 'gulp-sequence';
import uglify from 'gulp-uglify';
import cleanCSS from 'gulp-clean-css';
import url from 'url';
import fs from 'fs';
import path from 'path';
import log from 'fancy-log';
import manifest from '../src/loaders/manifest';
import asset from '../src/loaders/asset';
import loader from '../src/loaders/loader';
import {rel2abs, abs2rel, absdest, abstmp, tmp2abs, abssrc, tgtURL, calcMD5, writefile, cpfile} from '../src/helpers/utils';

gulp.task('copy', () => {
  return gulp.src('src/**/*')
    .pipe(gulp.dest('dest'));
});

gulp.task('compile', async () => {
  const routes = manifest.pages.routes();
  const destManifest = require('../dest/loaders/manifest').default;
  
  const ssrRoutes = (() => {
    const ssrRoutes = {};
    const routes = require('../dest/routes').default;
    for (const route of routes) {
      if (route.ssr) {
        ssrRoutes[route.path] = route.ssr;
      }
    }
    return ssrRoutes;
  })();

  const compile = async ({html, route, ext, extracts, task}) => {
    const ssrConfig = ssrRoutes[route];
    const destfiles = [];
    const extractfiles = [];
    const chunks = manifest.pages.chunks(route, ext) || {};

    const tasks = [];

    for (const chunk in chunks) {
      const files = chunks[chunk] || [];

      // compile
      const entryfiles = [];
      for (const file of files) {
        const {__compile: compile, __library: library} = asset.link.parse(file);
        const pathname = url.parse(file).pathname;
        if (compile === 'false') {
          const abspath = rel2abs(pathname);
          // build extra css link files
          if (ext == 'css') {
            const tmppath = abstmp(abspath);
            writefile(tmppath, asset.css.link(abspath));
            entryfiles.push({
              entry: tmppath
            });
          } else {
            entryfiles.push({
              entry: abspath
            });
          }
          
          continue;
        }

        const {filepath, chunks = []} = await (async () => {
          // this is ssr entry
          if (ssrConfig && ssrConfig.entry === pathname) {
            // compile ssr script file
            const {content, extract} = await loader.compile({
              pathname,
              target: 'node',
              extract: {
                ext: 'css'
              },
              library
            });
            writefile(absdest(pathname), content);

            extractfiles.push(extract);

            return await loader.compile({
              pathname,
              referer: route,
              extract: {
                ext: 'css'
              },
              library
            });
          } else {
            return await loader.compile({
              pathname,
              referer: route,
              library
            });
          }
        })();

        entryfiles.push({
          entry: filepath,
          chunks: chunks.map(chunk => chunk.filepath)
        });
      }

      tasks[chunk] = entryfiles;
    }

    if (extracts) {
      tasks['app'] = tasks['app'] || (tasks['app'] = []);
      for (const extract of extracts) {
        tasks['app'].push({
          entry: extract
        });
      }
    }

    for (const chunk in tasks) {
      const entryfiles = tasks[chunk];
      if (!entryfiles.length) {
        continue;
      }

      //{task, chunk, entryfiles}
      const tmppath = `./.tmp${path.dirname(html)}/__${chunk}.${ext}`;
      
      await task(entryfiles.map(entryfile => entryfile.entry), tmppath);

      const buffer = fs.readFileSync(tmppath);
      const hash = calcMD5(buffer);
      const destpath = absdest(`${path.dirname(html)}/${chunk}.${hash}.${ext}`);

      writefile(destpath, buffer);

      destfiles.push(abs2rel(destpath));

      // handle chunks 
      for (const {entry, chunks} of entryfiles) {
        if (!chunks || !chunks.length) {
          continue;
        }

        for (const chunk of chunks) {
          await task([chunk], absdest(abs2rel(chunk)));

          // cp to dest relative path 
          // to fixed ssr load js package problem
          /*
          console.log('>>>>>>entry:');
          console.log(chunk);
          console.log(absdest(abs2rel(entry)));
          console.log(absdest(abs2rel(chunk)));
          cpfile({
            from: chunk,
            to: path.join(absdest(abs2rel(path.dirname(entry))), tgtURL(abs2rel(chunk)))
          });
          */
      
        }
      }
    }

    return {destfiles, extractfiles};
  };


  for (const route in routes) {
    log(`Compiling '${route}'`);

    const html = manifest.pages.get(route, 'html');

    // compile html
    {
      asset.html.rels(rel2abs(html))
        .forEach((rel) => {
          writefile(absdest(abs2rel(rel)), asset.html.link((rel)));
        });
    }

    const cssextracts = [];

    // compile js
    {
      const jsfiles = await compile({
        route,
        html,
        ext: 'js',
        task: async (entryfiles, tmppath) => {
          return new Promise((resolve) => {
            return gulp.src(entryfiles)
              .pipe(uglify())
              .pipe(concat(path.basename(tmppath)))
              .pipe(gulp.dest(path.dirname(tmppath)))
              .on('end', resolve);
          });
        }
      });

      destManifest.pages.set(route, 'js', jsfiles.destfiles);

      (jsfiles.extractfiles || []).forEach(({filepath}) => cssextracts.push(filepath));      
    }

    // compile css
    {
      const cssfiles = await compile({
        route,
        html,
        ext: 'css',
        extracts: cssextracts,
        task: async (entryfiles, tmppath) => {
          return new Promise((resolve) => {
            return gulp.src(entryfiles)
              .pipe(concat(path.basename(tmppath)))
              .pipe(cleanCSS({}))
              .pipe(gulp.dest(path.dirname(tmppath)))
              .on('end', resolve);
          });
        }
      });

      destManifest.pages.set(route, 'css', cssfiles.destfiles);
    }    
  }
});

gulp.task('build', sequence(
  ['clean:dest', 'clean:tmp'],
  'copy',
  'compile',
  'clean:tmp'
)); 
