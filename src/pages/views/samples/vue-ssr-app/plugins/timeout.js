
export default {
  install(Vue) {
    Vue.mixin({
      created: function () {
        this.__timeoutids = [];
      },
      destroyed: function () {
        this.__timeoutids.forEach(clearTimeout);
      }
    });

    Vue.prototype.$setTimeout = function (handler, delay = 0) {
      const id = setTimeout(handler, delay);
      this.__timeoutids.push(id);
      return id;
    };

    Vue.prototype.$clearTimeout = function (id) {
      clearTimeout(id);
    };

    Vue.prototype.$clearAllTimeouts = function () {
      this.__timeoutids.forEach(clearTimeout);
    };
  }
};
