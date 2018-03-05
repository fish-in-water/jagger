import config from '../../config';

export default async (ctx, next) => {
  if (config.env === 'production') {
    return await next();
  }

  const method = ctx.method;
  const url = ctx.req.url;
  const starttime = +new Date;

  await next();

  console.log(`${method}:${url} ${+new Date - starttime}ms`);
}; 
