import path from 'path';
import fs from 'fs';
import asset from './asset';
import {isEmpty} from '../helpers/utils';
import routes from '../routes';

const filepath = path.join(__dirname, '../manifest.json');
const manifest = (() => {
  const manifest = JSON.parse(fs.readFileSync(filepath));
  const maps = routes.reduce((maps, route) => {
    maps[route.path] = route;
    return maps;
  }, {});
  const pages = manifest.pages || {};
  for (const page in pages) {
    if (!maps[page]) {
      delete pages[page];
    }
  }

  fs.writeFileSync(filepath, JSON.stringify(manifest, null, 2));

  return manifest;
})();

const getData = (key, obj = {}) => {
  const props = key.split('.');
  const val = obj[props[0]];
  if (props.length == 1) {
    return val;
  }

  return getData(props.slice(1).join('.'), val || {});
};

const setData = (key, val, obj = {}) => {
  const props = key.split('.');
  if (props.length == 1) {
    
    if (isEmpty(val)) {
      
      delete obj[props[0]];
    } else {
      obj[props[0]] = val;
    }

    fs.writeFileSync(filepath, JSON.stringify(manifest, null, 2));
    return;
  }

  setData(props.slice(1).join('.'), val, obj[props[0]] || (obj[props[0]] = {}));
};



export default {
  pages: {
    routes() {
      return getData('pages', manifest);
    },
    get(route, key) {
      const val = getData(`pages.${route}.${key}`, manifest);
      if (val) {
        return val;
      }

      const mainfestRoutes = this.routes();
      for (const item of routes) {
        if (!mainfestRoutes[item.path]) {
          continue;
        }

        if (item.path == '*') {
          return getData(`pages.*.${key}`, manifest);
        }
        if ((new RegExp(`$${item.path}`)).test(route)) {
          return getData(`pages.${item.path}.${key}`, manifest);
        }
      }
    },
    set(route, key, val) {
      return setData(`pages.${route}.${key}`, val, manifest);
    },
    remove(route) {
      return setData(`pages.${route}`, void 0, manifest);
    },
    chunks(route, key) {
      const files = getData(`pages.${route}.${key}`, manifest) || [];
      return files.reduce((chunks, file) => {

        const {__chunk = 'app'} = asset.link.parse(file);
        chunks[__chunk] = chunks[__chunk] || (chunks[__chunk] = []);
        chunks[__chunk].push(file);

        return chunks;
      }, {});
    }
  },
  externals: {
    get() {
      return getData('externals', manifest) || {};
    }
  }
};
