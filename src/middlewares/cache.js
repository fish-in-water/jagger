import url from 'url';
import fs from 'fs';
import config from '../../config';
import {calcMD5, srcUrl, abssrc, getExtname} from '../helpers/utils';
import asset from '../loaders/asset';

const expires = new Date('2099-12-31T23:59:59');
export default async (ctx, next) => {
  if (config.env === 'production') {
    const extname = getExtname(url.parse(ctx.req.url).pathname);
    if (extname) {
      ctx.set('Cache-Control', `max-age=${Math.floor((+expires - config.timestamp) / 1000)}, public`);
      ctx.set('Expires', expires.toUTCString());
    }
    return await next();
  }

  const queries = ctx.query || {};

  if (queries['__cache'] !== 'true') {
    return await next();
  }

  const pathname = srcUrl(url.parse(ctx.req.url).pathname);
  const ifNoneMatch = ctx.get('If-None-Match');

  //npm
  if (asset.externals.test(pathname)) {
    const etag = config.timestamp;
    if (ifNoneMatch != etag) {
      ctx.set('etag', etag);
      return await next();
    } else {
      return ctx.status = 304;
    }
  }

  const filepath = abssrc(pathname);
  if (!fs.existsSync(filepath)) {
    return await next();
  }

  const md5 = calcMD5(fs.readFileSync(filepath));
  const etag = `${config.timestamp}-${md5}`;
  if (ifNoneMatch != etag) {
    ctx.set('etag', etag);
    return await next();
  }
  
  ctx.status = 304;
}; 
