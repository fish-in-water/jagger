import fs from 'fs';
import path from 'path';
import qs from 'qs';
import url from 'url';
import {abs2rel, srcUrl, tgtURL, isEmptyObject, hashfile, writefile, absdest} from '../helpers/utils';
import config from '../../config';

const rels = (filepath, sregs) => {
  const rels = [];
   
  const iterator = (filepath) => {
    rels.push(filepath);

    const dirname = path.dirname(filepath);
    const content = fs.readFileSync(filepath, 'utf-8');

    const regs = sregs.map(sreg => new RegExp(sreg, 'gmi'));

    for (let reg of regs) {
      let exec = reg.exec(content);
      while (exec) {
        const relpath = path.join(dirname, exec[1]);

        iterator(relpath);

        exec = reg.exec(content);
      }
    }
  };

  iterator(filepath);

  return rels;
};

const link = (filepath, sregs) => {

  const dirname = path.dirname(filepath);
  let content = fs.readFileSync(filepath, 'utf-8');

  const regs = sregs.map(({match, from, to}) => {
    return {
      match: new RegExp(match, 'gmi'),
      from: new RegExp(from, 'gmi'),
      to
    };
  });

  for (const {match, from, to} of regs) {
    content = content.replace(match, ($0) => {
      return $0.replace(from, ($0, $1) => {
        if (/^(http(s)?:)?\/\//.test($1)) {
          return $0;
        }

        if (/data:[\s\S]*base64/gmi.test($1)) {
          return $0;
        }

        const abspath = path.join(dirname, asset.externals.is($1) ? 
          asset.externals.encode($1) : $1);

        const relpath = ((abspath) => {
          if (config.env !== 'production' || !config.assets.test(abspath)) {
            return abs2rel(abspath);
          }

          const { name, buffer } = hashfile(abspath);
          const destpath = `${path.dirname(absdest(abs2rel(abspath)))}${path.sep}${name}`;
          writefile(destpath, buffer);
          return abs2rel(destpath);

        })(abspath);

        return to.replace('$TO', tgtURL(relpath));
      });
    });
  }

  return content;
};

const asset = {
  html: {
    rels(filepath) {
      return rels(filepath, [
        '{%\\s*extends\\s*[\'"](\\S+)[\'"]\\s*%}',
        '{%\\s*include\\s*[\'"](\\S+)[\'"]\\s*%}'
      ]);
    },
    link(filepath) {

      return link(filepath, [
        {
          match: '<(\\w+)[^>]+src[^>]+>',  // equal /<(\w+)[^>]+src[^>]+>/
          from: 'src=[\'"]?([^\'"]+)[\'"]?', // equal /src=['"]?([^'"]+)['"]?/
          to: 'src="$TO"'
        },
        {
          match: '<(link)[^>]+href[^>]+>',  // equal /<(\w+)[^>]+href[^>]+>/
          from: 'href=[\'"]?([^\'"]+)[\'"]?',  // equal /href=['"]?([^'"]+)['"]?/
          to: 'href="$TO"'
        },
        {
          match: '<(\\w+)[^>]+url[^>]+>',  // equla /<(\w+)[^>]+url[^>]+>/
          from: 'url\\([\'"]?([^\'")]+)[\'"]?\\)',  // equla /url\(['"]?([^'")]+)['"]?\)/gmi
          to: 'url($TO)'
        }
      ]);
    }
  },
  css: {
    rels(filepath) {
      return rels(filepath, [
        '\\s*@import\\s*[\'"]+([^\'"]+)[\'"]+'
      ]);
    },
    link(filepath) {
      return link(filepath, [
        {
          match: '[\\S]*url[\\S]*',  // [\S]*url[\S]*
          from: 'url[(]?([^)]+)[)]?',
          to: 'url($TO)'
        }
      ]);
    }
  },
  tags: {
    parse(tagname, content) {
      const tags = [];
      const reg = new RegExp(`<${tagname} ([^>]+)></${tagname}>`, 'gmi');

      {
        let exec = reg.exec(content);
        while (exec) {
          const props = {};
          const kvs = exec[1].split(/\s+/);
          for (const kv of kvs) {
            const matches = kv.match(/(\w+)=['"]+(\S+)['"]+/);
            if (matches) {
              const key = matches[1].toLowerCase();
              const val = matches[2];

              props[`__${key}`] = val;
            }
          }
          tags.push(props);
          exec = reg.exec(content);
        }
      }

      return tags;
    }
  },
  link: {
    stringify(props) {
      const src = srcUrl(props['__src']);
      const clone = {...props};
      delete clone['__src'];

      // cache npm default
      if (asset.externals.test(src)) {
        clone['__cache'] = clone['__cache'] || true;
      }

      if (isEmptyObject(clone)) {
        return src;
      }

      return `${src}?${qs.stringify(clone)}`;
    },
    parse(pathname) {
      return qs.parse(url.parse(pathname).query);
    }
  },
  externals: {
    is(url) {
      return !/^\./.test(url);
    },
    test(url) {
      const basename = path.basename(url);
      return /^__[^_]+/.test(basename);
    },
    encode(url) {
      return `__${url}.js`;
    },
    decode(url) {
      const basename = path.basename(url);
      const matches = basename.match(/__([^.]+)/);
      return matches ? matches[1].replace(/__/g, '/') : void 0;
    }
  }
};

export default asset;
