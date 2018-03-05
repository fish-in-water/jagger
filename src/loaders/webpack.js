import fs from 'fs';
import path from 'path';
import url from 'url';
import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import config from '../../config';
import webpackConfig from '../../webpack.config';
import {abs2rel, abstmp, srcUrl, cpfile, isEmptyObject, radom} from '../helpers/utils';
import asset from '../loaders/asset';
import manifest from '../loaders/manifest';

export default async ({filepath, referer, target = 'web', extract, library}) => {
  return new Promise((resolve, reject) => {

    //const extname = path.extname(filepath);
    const tmppath = abstmp(abs2rel(filepath));

    const tgtConfig = {
      ...webpackConfig,
      entry: {
        'entry': filepath 
      },
      output: {
        path: path.dirname(tmppath),
        filename: path.basename(tmppath),
        libraryTarget: 'umd',
        chunkFilename: config.env == 'production' ?
          '[name].[hash:12].js' : '[name].js?__temporary=true'
      },
      target,
      plugins: [...(webpackConfig.plugins || [])]
    };
    
    if (asset.externals.test(filepath)) {
      const library = asset.externals.decode(filepath);
      tgtConfig.entry = {'entry': library};
      tgtConfig.output.library = library;
    } 

    if (library) {
      tgtConfig.output.library = library;
    }

    if (referer) {
      const externals = {};
      (manifest.pages.get(referer, 'js') || []).forEach((js) => {
        if (asset.externals.test(js)) {
          const external = asset.externals.decode(js);
          externals[external] = external;
        }
      });

      const global = manifest.externals.get();
      for (const external in global) {
        externals[external] = global[external];
      }

      if (asset.externals.test(filepath)) {
        const library = asset.externals.decode(filepath);
        delete externals[library];
      }

      if (!isEmptyObject(externals)) {
        tgtConfig.externals = externals;
      }
    }

    let extfile = null;
   
    if (extract) {
      const {ext} = extract;
      const plugins = tgtConfig.plugins || (tgtConfig.plugins = []);
      extfile = tmppath.replace(/\.\w+$/, `.${radom()}.${ext}`);
      //const extfile = `${path.dirname(tmppath)}/${ext}_${+new Date}_${radom(0, Number.MAX_VALUE)}.${ext}`

      plugins.push(
        new ExtractTextPlugin(path.basename(extfile))
      );
    }

    const compiler = webpack(tgtConfig);

    compiler.run((err, stats) => {
      try {
        if (err) {
          return reject(err);
        }
        
        const res = {
          content: fs.readFileSync(tmppath),
          filepath: tmppath
        };

        // extract
        {
          if (extract && fs.existsSync(extfile)) {
            res.extract = {
              content: fs.readFileSync(extfile),
              filepath: extfile
            };
          }
        }

        // chunks
        {
          const chunks = stats.compilation.chunks;
          if (chunks && chunks) {
            res.chunks = [];
            for (const chunk of chunks) {
              if (chunk.name == 'entry') {
                continue;
              }

              for (const file of chunk.files) {
                const pathname = url.parse(file).pathname;
                const abspath = abstmp(srcUrl(pathname));

                cpfile({
                  from: `${path.dirname(tmppath)}${pathname}`,
                  to: abspath
                });

                res.chunks.push({
                  content: fs.readFileSync(abspath),
                  filepath: abspath
                });
              }
            }
          }
        }

        return resolve(res);
      } catch (ex) {
        reject(ex);
      }
    });
  });
};
