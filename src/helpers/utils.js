const config = require('../../config');

export const _require = (path) => {
  return require(path);
};

export const noop = () => {};

export const tgtRoute = (route) => {
  return (`${config.baseUrl}${route}`).replace(/\\/gmi, '/');
};

export const srcRoute = (url) => {
  return (url.replace(new RegExp(`^${config.baseUrl}`), '')).replace(/\\/gmi, '/');
};

export const tgtURL = (url) => {
  const tgtBase = config.env == 'production' ?
    config.cdnUrl : config.baseUrl;
  return (`${tgtBase}${url.replace(/\\/gmi, '/').replace(/^\/pages/, '')}`).replace(/\\/gmi, '/');
};

export const srcUrl = (url) => {
  const tgtBase = config.env == 'production' ?
    config.cdnUrl : config.baseUrl;
  return (url.replace(new RegExp(`^${tgtBase}`), '/pages')).replace(/\\/gmi, '/');
};

export const getExtname = (pathname) => {
  const path = _require('path');
  return path.extname(pathname);
};

export const calcMD5 = (str, len = 12) => {
  const crypto = _require('crypto');
  const md5 = crypto.createHash('md5').update(str).digest('hex');
  return md5.substring(md5.length - len, md5.length);
};

export const isEmpty = (val) => {
  return typeof val === 'undefined' || val === null;
};

export const isEmptyObject = (obj) => {
  if (typeof obj !== 'object') {
    return false;
  }

  for (const key in obj) {
    return false;
  }

  return true;
};

export const mkdirs = (dirname) => {
  const fs = _require('fs');
  const path = _require('path');
  const dirs = dirname.split(path.sep);
  for (let i = 1, ii = dirs.length; i < ii; i++) {
    const tmp = dirs.slice(0, i + 1).join(path.sep);
    if (!fs.existsSync(tmp)) {
      fs.mkdirSync(tmp);
    }
  }
};

export const writefile = (filepath, content) => {
  const fs = require('fs');
  const path = _require('path');
  mkdirs(path.dirname(filepath));
  fs.writeFileSync(filepath, content);
};

export const hashfile = (filepath) => {
  const fs = _require('fs');
  const path = _require('path');
  const buffer = fs.readFileSync(filepath);
  const hash = calcMD5(buffer);

  return {
    name: path.basename(filepath).replace(/\.\w+$/, ($0) => {
      return `.${hash}${$0}`;
    }),
    buffer
  };
};

export const cpfile = ({from, to}) => {
  const fs = _require('fs');
  const path = _require('path');

  mkdirs(path.dirname(to));

  fs.writeFileSync(to, fs.readFileSync(from));
};

export const rel2abs = (relpath) => { 
  const path = _require('path');
  return path.join(__dirname, `..${path.sep}${relpath}`).replace(/\//gmi, path.sep);
};

export const abs2rel = (abspath) => {
  const path = _require('path');
  const basedir = path.join(__dirname, '../..').replace(/\\/gmi, '/');
  return abspath.replace(/\\/gmi, '/').replace(new RegExp(`^${basedir}/[^/]+`), '').replace(/\//gmi, path.sep);
};

export const abssrc = (relpath) => {
  const path = _require('path');
  return path.join(__dirname, `../../src/${path.sep}${relpath}`).replace(/\//gmi, path.sep);
};

export const absdest = (relpath) => {
  const path = _require('path');
  return path.join(__dirname, `../../dest/${path.sep}${relpath}`).replace(/\//gmi, path.sep);
};

export const abstmp = (relpath) => {
  const path = _require('path');
  return path.join(__dirname, `../../.tmp/${path.sep}${relpath}`).replace(/\//gmi, path.sep);
};

export const isBrowser = () => {
  return typeof window !== 'undefined';
};

export const isServer = () => {
  return !isBrowser();
};

export const getData = (obj, key) => {
  if (obj == null) {
    return obj || null;
  }

  const props = key.split('.');
  const prop = props.shift();
  const tmp = ((obj, prop) => {
    const matches = prop.match(/(\w*)\[(\w+)\]/);
    if (!matches) {
      return obj[prop];
    } 

    const tmp = matches[1] ? 
      (obj[matches[1]] || []) : obj;

    // array, like d5[3]
    return tmp[matches[2]];
  })(obj, prop);

  if (props.length == 0) {
    return tmp || null;
  } else {
    return getData(tmp || null, props.join('.'));
  }
};

export const setData = (obj, key, value) => {
  const props = key.split('.');
  const prop = props.shift();
  if (props.length == 0) {
    return obj[prop] = value;
  }

  //obj[prop] || (obj[prop] = {})
  const tmp = ((obj, prop) => {
    const matches = prop.match(/(\w+)\[(\w+)\]/);
    // normal obj
    if (!matches) {
      return obj[prop] || (obj[prop] = {});
    } 

    // array, like d5[3]
    const key = matches[1];
    const index = matches[2];
    const arr = obj[key] || (obj[key] = []);
    return arr[index] || (arr[index] = {});
  })(obj, prop);
  return setData(tmp, props.join('.'), value);



  /*
  const value = ((prop, obj) => {
    const matches = prop.match(/(\w+)\[(\d+)\]/);
    if (!matches) {
      return obj[prop];
    } 
    // array, like d5[3]
    return (obj[matches[1]] || [])[matches[2]];
  })(prop, obj);
  */
};

export const radom = (m = 0, n = 100000000) => {
  return Math.floor(Math.random() * (n - m + 1)) + m;
};

export const queryString = (url) => {
  const qs = {};
  var matches = url.match(/[^=?&#]+=[^=?&#]+/g);
  if (matches) {
    for (const match of matches) {
      const kv = match.split('=');
      qs[kv[0]] = kv[1];
    }
  }
  return qs;
};

export const sleep = (delay) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, delay);
  });
};

export const range = (start, end) => {
  const arr = [];
  for (let i = start; i <= end; i++) {
    arr.push(i);
  }
  return arr;
};

export const getDateTime = (s) => {
  const exec = (/(\d+)-(\d+)-(\d+)\s+(\d+):(\d+):(\d+)/.exec(s));
  const year = exec[1] - 0;
  const month = exec[2] - 1;
  const date = exec[3] - 0;
  const hh = exec[4] - 0;
  const mi = exec[5] - 0;
  const ss = exec[6] - 0;
  return new Date(year, month, date, hh, mi, ss);
};

export const getFormatDate = (date, format) => {
  const obj = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
    'q+': Math.floor((date.getMonth() + 3) / 3),
    'S': date.getMilliseconds()
  };

  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }

  for (const key in obj) {
    if (new RegExp(`(${key})`).test(format)) {
      format = format.replace(RegExp.$1, (RegExp.$1.length == 1) ?
        (obj[key]) : ((`00${obj[key]}`).substr((obj[key] + '').length)));
    }
  }

  return format;
};

let counter = 0;
export const getUnique = (prefix) => {
  return `${prefix || ''}${counter++}`;
};












