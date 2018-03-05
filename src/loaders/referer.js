import fs from 'fs';
import path from 'path';
import manifest from '../loaders/manifest';
import {tgtURL} from '../helpers/utils';
import config from '../../config';

let refers = {};
const referer = {
  get({route, next}) {
    const nexts = (refers[route] || (refers[route] = []))
      .filter((refer) => refer.route == next);
  
    return nexts.length 
      ? nexts[0] : 
      {
        route: next, 
        count: 0,
        files: (() => {
          const cssfiles = manifest.pages.get(next, 'css') || [];
          const jsfiles = manifest.pages.get(next, 'js') || [];

          return [].concat(cssfiles).concat(jsfiles);
        })()
      };
  },
  set({route, next, data}) {
    const nexts = refers[route] || (refers[route] = []);

    for (let i = 0, ii = nexts.length; i < ii; i++) {
      if (nexts[i].route === next) {
        nexts[i] = data;
        return;
      }
    }

    nexts.push(data);
  },
  dot({route, next}) {

    process.nextTick(() => {
      
      const data = referer.get({route, next});

      data.count++;

      this.set({route, next, data});
    });
  },
  next({route, limit = 3}) {
    return (refers[route] || (refers[route] = [])).slice(0, limit);
  },
  sort() {
    for (const route in refers) {
      (refers[route] || (refers[route] = []))
        .sort((current, next) => {
          return current.count < next.count;
        });
    }
  },
  clear() {
    refers = {};
  }
};

if ((config.mirage && config.mirage.enable)
  && config.env === 'production') {
  setInterval(referer.sort, config.mirage.interval || 60000);
}

// excute per mintue
//schedule.scheduleJob('* * * * * *', referer.sort);

// excute per am: 03:00:00
//schedule.scheduleJob('* 3 * * * *', referer.clear);



export default referer;
