import path from 'path';
import winston from 'winston';
import Daily from 'winston-daily-rotate-file';
import {mkdirs} from './utils';
import config from '../../config';

const dir = path.join(__dirname, '../../logs').replace(/\//gmi, path.sep);

mkdirs(dir);

const transports = [];
transports.push(new winston.transports.Console());

const levels = {
  'debug': ['debug', 'info', 'warn', 'error'],
  'info':  ['info', 'warn', 'error'],
  'warn':  ['warn', 'error'],
  'error': ['error']
}[config.logger.level];

levels.forEach((level) => {
  transports.push(new Daily({
    level: level,
    name: `file.${level}`,
    filename: `${dir}/${level}.log`,
    timestamp: true,
    maxsize: config.logger.maxsize,
    json: true,
    maxDays: 10
  }));
});

const logger = new (winston.Logger)({
  transports
});

export default {
  debug() {
    logger.debug.apply(logger, Array.from(arguments));
  },

  info() {
    logger.info.apply(logger, Array.from(arguments));
  },

  warn() {
    logger.warn.apply(logger, Array.from(arguments));
  },

  error() {
    logger.error.apply(logger, Array.from(arguments));
  }
};






