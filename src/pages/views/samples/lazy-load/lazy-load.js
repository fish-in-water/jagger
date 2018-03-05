import $ from 'jquery';

$(() => {
  $('#load').click(async () => {
    const module = await (() => {
      return new Promise((resolve) => {
        require('../../../../loaders/lazy!./lazy-module.js')((module) => {
          resolve(module.default);
        });
      });
    })();

    module.say();
  });
});
