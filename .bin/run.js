require('babel-register');
require('babel-polyfill');
require(process.env.ENTRY || '../src/app.js');

