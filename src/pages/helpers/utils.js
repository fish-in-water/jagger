

export const isAndroid = () => {
  return /android/i.test(navigator.userAgent);
};

export const isIPhone = () => {
  return /iphone/i.test(navigator.userAgent);
};

export const isMobile = () => {
  return isAndroid() || isIPhone();
};

export const qs = {
  stringify(obj = {}) {
    const arr = [];
    for (const key in obj) {
      arr.push(`${key}=${obj[key]}`);
    }
    return arr.join('&');
  },
  parse(qs = '') {
    const obj = {};
    const arr = qs.split('&');
    for (const item of arr) {
      const kv = item.split('=');
      obj[kv[0]] = kv[1];
    }
    return obj;
  }
};
