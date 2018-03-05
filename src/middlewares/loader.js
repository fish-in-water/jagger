import url from 'url';
import fs from 'fs';
import {srcUrl, srcRoute, abstmp} from '../helpers/utils';
import loader from '../loaders/loader';
import asset from '../loaders/asset';
import config from '../../config';

export default async (ctx, next) => {
  if (config.env === 'production') {
    return await next();
  }

  const queries = ctx.query || {};

  if (queries['__compile'] === 'false') {
    return await next();
  }

  if (queries['__temporary'] === 'true') {
    const tmpname = abstmp(srcUrl(url.parse(ctx.req.url).pathname));
    ctx.body = fs.readFileSync(tmpname, 'utf-8');
    return ;
  }

  const pathname = srcUrl(url.parse(ctx.req.url).pathname);

  if (!loader.test({pathname})) {
    return await next();
  }

  const {__library: library = ''} = asset.link.parse(ctx.req.url);
  const referer = srcRoute(url.parse((ctx.req.headers['referer'] || '')).pathname) || '*';
  const {type, content} = await loader.compile({pathname, referer, library});

  ctx.type = type;
  ctx.body = content;
};   
