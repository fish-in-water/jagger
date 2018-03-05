import $ from 'Zepto';
import config from '../../../config';

$(() => {
  if (!config.mirage || !config.mirage.enable 
    || config.env !== 'production') {
    return;
  }

  const caches = window.__CACHES__ || [];
  for (const cache of caches) {
    const image = new Image;
    image.src = cache;
  }
});
