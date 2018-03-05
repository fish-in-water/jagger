import base64 from 'base-64';
import http from '../../helpers/http';
import {tgtRoute} from '../../helpers/utils';
import config from '../../../config';

const levels = {
  'debug': ['debug', 'info', 'warn', 'error'],
  'info':  ['info', 'warn', 'error'],
  'warn':  ['warn', 'error'],
  'error': ['error']
}[config.logger.level]
  .reduce((levels, level) => {
    levels[level] = level;
    return levels;
  }, {});

const logger = (message, level = 'debug') => {
  if (!levels[level]) {
    return;
  }

  const data = JSON.stringify({
    level,
    message: typeof msg == 'object' ? 
      JSON.stringify(message) :  message,
    timestamp: (new Date).toISOString()
  });

  if (config.env !== 'production') {
    console.log(data);
  }

  http({
    method: 'get',
    url: tgtRoute(`/s.gif?s=${base64.encode(data)}`),
  });
}; 

Object.assign(logger, {
  debug(message) {
    logger(message, 'debug');
  },

  info(message) {
    logger(message, 'info');
  },

  warn(message) {
    logger(message, 'info');
  },

  error(message) {
    logger(message, 'error');
  }
});

export default logger;
