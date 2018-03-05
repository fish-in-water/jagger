import Router from 'koa-router';
import url from 'url';
import config from '../../config';
import routes from '../routes';
import ssr from '../loaders/ssr';
import {tgtRoute, srcRoute, noop} from '../helpers/utils';
import logger from '../helpers/logger';

const router = new Router();

// forward
router.forward = async (path, ctx) => {
  action(path, ctx);
};

const action = async (path, ctx) => {
  const {action = noop, status = 200, view, ssr: ssrConfig, title, data: defaultData = {}} = 
    routes.filter((route) => route.path === path)[0];

  try {
    const queries = ctx.query || {};
    
    let data = null;
    if (ssrConfig && (config.env === 'production' || queries.__ssr)) {
      const {type, entry} = ssrConfig;
      const {html, state, enable} = await ssr[type]({entry, route: ctx.req.url});
      data = await action({ctx, ssr: {html, state, enable}});
    } else {
      data = await action({ctx});
    }

    ctx.status = status;
    if (view) {
      ctx.render(view, {title, ...defaultData, ...data});
    } else {
      ctx.json({...defaultData, ...data});
    }
  } catch (ex) {

    logger.error(ex);
    
    ctx.status = 500;
    if (config.env !== 'production') {
      return ctx.json(ex);
    }

    if (view) {
      return await router.forward('/500', ctx);
    }

    return ctx.json('error');
  }
};

// attach 404, 500
routes.push(...[
  {
    path: '/500',
    status: 500,
    title: '500',
    view: '/pages/views/500/500.swig'
  },
  {
    path: '/*',
    status: 404,
    title: '404',
    view: '/pages/views/404/404.swig'
  }
]);

// mount routes
for (const route of routes) {
  const {method = 'get', path} = route;
  router[method](`${tgtRoute(path)}`, async (ctx) => action(path, ctx));
}



export default router;

