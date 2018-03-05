import url from 'url';
import base64 from 'base-64';
import {srcRoute} from '../helpers/utils';
import logger from '../helpers/logger';

export default async (ctx, next) => {

  const route = srcRoute(url.parse(ctx.req.url).pathname);
  if (route !== '/s.gif') {
    return await next();
  }

  logger.warn(base64.decode(ctx.query.s || ''));

  ctx.json('');
};
