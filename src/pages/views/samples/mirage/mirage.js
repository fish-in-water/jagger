import $ from 'Zepto';
import {tgtRoute} from '../../../../helpers/utils';

$(() => {
  $('#btn').click(() => {
    location.href = tgtRoute('/samples/vue-ssr-app');
  });
});
