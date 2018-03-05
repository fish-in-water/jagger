const env = process.env.NODE_ENV || 'production';
const test = process.env.TEST_ENV || '';

// use webpack env to sep server and client config
// so server config cannot be seen in client
// do not modify anything here
const targetConfig = require(process.env.TARGET == 'client' ? 
  './client.config.js' : './server.config.js');

module.exports = {
  timestamp: +new Date, 
  env,
  test,
  port: 3002,
  baseUrl: process.env.BASE_URL || '/jagger',
  cdnUrl: process.env.CDN_URL || '/jagger',
  assets: /\.(png|jpe?g|gif|svg|pdf|ico)(\?.*)?$/i,
  browserSync: {
    port: 3000,
    reloadDelay: 300,
    notify: false
  },
  ...{
    // dev
    dev: {
      logger: {
        level: 'debug',
        maxsize: 100 * 1024 * 1024
      }
    },

    // production
    production: {
      logger: {
        level: 'warn',
        maxsize: 100 * 1024 * 1024
      }
    }
  }[test || env],
  ...targetConfig,
};
