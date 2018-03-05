import $ from 'Zepto';
import {isMobile} from '../helpers/utils';

$(() => {
  const $body = $('body');

  // PC
  if (!isMobile()) {
    const onclick = (ev) => {
      $(ev.srcElement).trigger('tap');
    };
    $body.on('click', onclick);
    return;
  }

  let start = null;
  let end = null;
  const ontouchstart = (ev) => {
    const touch = ev.touches[0];
    end = start = {
      el: ev.srcElement,
      cx: touch.clientX,
      cy: touch.clientY
    };
  };
  const ontouchmove = (ev) => {
    const touch = ev.touches[0];
    end = {
      el: ev.srcElement,
      cx: touch.clientX,
      cy: touch.clientY
    };
  };
  const ontouchend = () => {
    if (start && end) {
      if (Math.abs(end.cx - start.cx) < 20 
      && Math.abs(end.cy - start.cy) < 20) {
        $(start.el).trigger('tap');
      }
    }

    end = start = null;
  };

  $body.on('touchstart', ontouchstart);
  $body.on('touchmove', ontouchmove);
  $body.on('touchend', ontouchend);
});
