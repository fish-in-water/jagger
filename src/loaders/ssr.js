import {abssrc, abstmp, absdest, writefile, radom} from '../helpers/utils';
import webpack from '../loaders/webpack';
import routes from '../routes';
import config from '../../config';

// pre-load ssr entry
if (config.env === 'production') {
  for (const route in routes) {
    const {ssr: {entry} = {}} = routes[route];
    if (entry) {
      require(absdest(entry));
    }
  }
}

export default {
  async vue({entry, route}) {
    
    return new Promise(async (resolve, reject) => {
      try {
        const filepath = await (async () => {
          if (config.env === 'production') {
            return absdest(entry);
          } 

          const {content} = await webpack({
            filepath: abssrc(entry), 
            //referer: srcUrl(url.parse(route).pathname),
            target: 'node', 
            extract: {ext: 'css'}});
          const tmppath = `${abstmp(entry)}.${radom()}.js`;

          writefile(tmppath, content);

          return tmppath;
        })();
        
        const {createApp} = require(filepath);
        const {app, router, store} = createApp();

        router.push(route);
        router.onReady(() => {
          const components = router.getMatchedComponents();
          if (!components.length) {
            return reject('not found');
          }

          Promise.all(components.map(({asyncData}) => {
            return asyncData && asyncData({store, route: router.currentRoute});
          })).then(async () => {
            const renderer = require('vue-server-renderer').createRenderer();
            const html = await renderer.renderToString(app);

            resolve({
              enable: true,
              html,
              state: store.state
            });

          }).catch(reject);
        }, reject);
      } catch (ex) {
        reject(ex);
      }
    });
  }
};
