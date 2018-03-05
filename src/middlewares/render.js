import swig from 'swig';
import url from 'url';
import minify from 'html-minifier';
import config from '../../config';
import manifest from '../loaders/manifest';
import asset from '../loaders/asset';
import router from '../loaders/router';
import referer from '../loaders/referer';
import {srcRoute, srcUrl, writefile, abssrc, abstmp, absdest, abs2rel, tgtURL} from '../helpers/utils';

swig.setDefaults({
  cache: config === 'production'
});

const routes = router.stack.reduce((routes, {path, regexp}) => {
  routes.push({
    route: path, 
    regexp
  });
  return routes;
}, []);

const getRoute = (route) => {
  for (const {route: tmproute, regexp} of routes) {
    if (regexp.test(route)) {
      return tmproute;
    }
  }

  throw 'not found';
};


export default () => {
  return async (ctx, next) => {
    
    ctx.render = async (viewpath, data) => {
      const route = srcRoute(getRoute(url.parse(ctx.req.url).pathname));

      if ((config.mirage && config.mirage.enable)
        && config.env === 'production') {
        Object.assign(data, {
          __CACHES__: JSON.stringify(
            referer.next({route, limit: config.mirage.limit})
              .reduce((files, route) => {
                files.push(...route.files.map(tgtURL));
                return files;
              }, [])
          )
        });
      }

      let html = null;
      if (config.env !== 'production') {
        asset.html.rels(abssrc(viewpath))
          .forEach((rel) => {
            writefile(abstmp(abs2rel(rel)), asset.html.link(rel));
          });

        html = swig.compileFile(abstmp(viewpath))(data);  
      } else {
        html = swig.compileFile(absdest(viewpath))(data);  
      }

      const tags = [
        {
          tagname: 'css',
          from: '<!-- CSS_FILE -->',
          to: '<link rel="stylesheet" type="text/css" href="$SRC"/>'
        },
        {
          tagname: 'js',
          from: '<!-- JS_FILE -->',
          to: '<script type="text/javascript" src="$SRC"></script>'
        }
      ];

      // collect res
      if (config.env !== 'production') {
        const page = {};

        //manifest.pages.remove(route);
        manifest.pages.set(route, 'html', viewpath);

        for (const {tagname} of tags) {
          const urls = asset.tags.parse(tagname, html).map(asset.link.stringify);
          manifest.pages.set(route, tagname, urls.map(srcUrl));
        }  
      }

      // delete tags
      for (const {tagname} of tags) {
        html = html.replace(new RegExp(`<${tagname} ([^>]+)></${tagname}>`, 'gmi'), '');
      }

      // attach res
      for (const {tagname, from, to} of tags) {
        const urls = manifest.pages.get(route, tagname) || [];
        html = html.replace(from, urls.reduce((links, url) => {
          links.push(to.replace('$SRC', `${tgtURL(url)}`));
          return links;
        }, []).join('\r\n'));
      }

      ctx.type = 'text/html;charset=utf-8'; 
      ctx.body = config.env !== 'production' ?
        html : minify.minify(html, {
          conservativeCollapse: true,
          removeAttributeQuotes: true,
          collapseWhitespace: true,
          ignoreCustomComments: true
        });

      // record referer  
      if ((config.mirage && config.mirage.enable)
        && config.env === 'production') {
        const ref = ctx.req.headers['referer'];
        if (ref) {
          const refRoute = srcRoute(url.parse(ref).pathname);
          if (route == refRoute) {
            return;
          }

          referer.dot({
            route: refRoute, 
            next: route
          });
        }
      }
    };

    ctx.json = async (data) => {
      ctx.type = 'application/json;charset=utf-8';  
      ctx.body = JSON.stringify(data);
    };

    await next();
  };
};  
