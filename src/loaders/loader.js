import {getExtname, abssrc} from '../helpers/utils';
import config from '../../loader.config';

const loaders = config.loaders
  .map((loader) => {
    return {
      ...loader,
      loader: require(`../${loader.loader}`).default
    };
  })
  .reduce((loaders, loader) => {
    loaders[loader.fromext] = loader;
    return loaders;
  }, {});

export default {
  test({pathname}) {
    const extname = getExtname(pathname);
    if (!extname) {
      return false;
    }

    return !!loaders[extname];
  },
  async compile({pathname, target, referer, extract, library}) {
    const extname = getExtname(pathname);
    const {type, loader} = loaders[extname];

    const res = await loader({
      filepath: abssrc(pathname),
      referer,
      target,
      extract,
      library
      //externals: asset.externals.all(referer)
    });

    return {...res, type};
  }
}; 
