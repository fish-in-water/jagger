import $ from 'jquery';

$(() => {
  const $counter = $('#counter');
  window.setInterval(() => {
    $counter.html((new Date).toString());
  }, 1000);
});


