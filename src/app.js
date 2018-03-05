import Koa from 'koa';
import parser from 'koa-bodyparser';
import stetic from 'koa-static';
import mount from 'koa-mount';
import compress from 'koa-compress';
import router from './loaders/router';
import monitor from './middlewares/monitor';
import cache from './middlewares/cache';
import render from './middlewares/render';
import loader from './middlewares/loader';
import logger from './middlewares/logger';
import config from '../config';

const app = new Koa;

app.use(monitor);
app.use(parser());
app.use(compress());
app.use(cache);
app.use(loader);
app.use(render());
app.use(logger);
app.use(mount(`${config.baseUrl}`, stetic(__dirname + '/pages')));
app.use(router.routes(), router.allowedMethods());

app.listen(config.port);  

console.log(`server started at: ${(new Date)}`);
console.log(`current env is: ${config.env}`);




