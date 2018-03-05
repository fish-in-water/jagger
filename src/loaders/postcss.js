import fs from 'fs';
import webpack from './webpack';

export default async ({filepath}) => {
  return new Promise(async (resolve, reject) => {
    if (!fs.existsSync(filepath)) {
      return reject('file not exists');
    }

    const {extract} = await webpack({
      filepath,
      extract: {
        ext: 'css'
      }
    });

    resolve(extract);

    // use postcss compiler
    /*
    asset.css.rels(filepath)
      .forEach((rel) => {
        writefile(abstmp(abs2rel(rel)), asset.css.link(rel));
      });

    const tmppath = abstmp(abs2rel(filepath));

    postcss([
      precss
    ]).process(fs.readFileSync(filepath), {from: tmppath, map: {inline: true}}).then(result => {
      resolve({
        content: result.css,
        //tmppath
      });
    });
    */
  });
};
