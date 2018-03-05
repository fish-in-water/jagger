

export default {
  install(Vue) {
    Vue.mixin({
      created: function () {
        this.__intervalids = [];
      },
      destroyed: function () {
        this.__intervalids.forEach(clearInterval);
      }
    });

    Vue.prototype.$setInterval = function (handler, delay = 0, immediate = false) {
      if (immediate) {
        handler();
      }

      const id = setInterval(handler, delay);
      this.__intervalids.push(id);

      return id;
    };

    Vue.prototype.$clearInterval = function (id) {
      clearInterval(id);
    };

    Vue.prototype.$clearAllIntervals = function () {
      this.__intervalids.forEach(clearInterval);
    };
  }
};
