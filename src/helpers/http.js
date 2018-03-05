import axios from 'axios';
import {isServer} from '../helpers/utils';

const http = async (opts) => {
  const { url, retry } = opts;

  Object.assign(opts, {
    url: !/^http(s)?:/.test(url) && isServer() ?
      `http:${url}` : url,
    timeout: (retry && --retry.total) ?
      retry.timeout : opts.__timeout
  });

  try {
    return await axios(opts);
  } catch (ex) {
    if (!retry.total) {
      return Promise.reject(ex);
    }

    return await http(opts);
  }
};

export default async (opts) => {
  // backups
  opts.__timeout = opts.timeout || 15000;

  return await http(opts);
};




