<template>
  <div id='app'>
    <transition :name='view.slide'>
      <router-view class='__view'>
      </router-view> 
    </transition>

    <div class='__view __loading leave'>
      <div class='ui-loading-block show'>
        <div class='ui-loading-cnt'>
            <i class='ui-loading-bright'></i>
            <p>请稍候</p>
        </div>
      </div> 
    </div>
  </div>
</template>

<style lang='postcss' scoped>

  #app {
    position: relative;
    margin: 0 auto;
    max-width: 670px;
    min-height: 100%;
    background-color: #fff;
    overflow-y: hidden;
  }

  .__view {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    background-color: #fff;
  }

  .__loading {
    z-index: 10000;

    &.animate {
      transition: transform .5s;
    }

    &.enter {
      transform: translate3d(0, 0, 0);
    }

    &.leave {
      transform: translate3d(100%, 0, 0);
    }
  }   

  .__slide-in-enter-active,
  .__slide-in-leave-active,
  .__slide-out-enter-active,
  .__slide-out-leave-active {
    transition: transform .5s;
  }


  .__slide-in-enter-active,
  .__slide-out-leave-active {
    z-index: 1001;
  }

  .__slide-in-enter,
  .__slide-out-leave-to {
    transform: translate3d(100%, 0, 0);
  }
    
</style>

<script>
import {isBrowser} from '../../../../helpers/utils';

export default {
  data() {
    return {
      view: {
        slide: '',
      },
      loading: {
        slide: '',
        visiable: false,
        waiting: false,
        timeout: null
      }
    };
  },
  methods: {
    slideInView() {
      this.view.slide = '__slide-in';
    },
    slideOutView() {
      this.view.slide = '__slide-out';
    },
    slideInLoading() {
      if (!isBrowser()) {
        return;
      }

      const $ = window.Zepto;
      const $loading = $('#app > .__loading');

      $loading.removeClass('enter').addClass('animate leave').show();

      this.timeoutid = this.$setTimeout(() => {
        $loading.removeClass('leave').addClass('enter');
      }, 1000 / 60);


      //
      /*
      this.loading.slide = '';
      this.loading.visiable = true;
      this.loading.timeout = this.$setTimeout(() => {
        this.loading.slide = 'enter-to';
        this.showLoading();
      }, 1000 / 60);
      */
    },
    slideOutLoading() {
      if (!isBrowser()) {
        return;
      }

      const $ = window.Zepto;
      const $loading = $('#app > .__loading');

      this.timeoutid = this.$setTimeout(() => {
        $loading.removeClass('enter').addClass('leave');
      }, 1000 / 60);

      /*
      setTimeout(() => {
        this.loading.slide = '';
      }, 1000 / 60);
      */
    },
    showLoading() {
      if (!isBrowser()) {
        return;
      }

      const $ = window.Zepto;
      const $loading = $('#app > .__loading');

      $loading.removeClass('enter animate').addClass('leave').show();
      /*
      this.loading.slide = 'enter-to';
      this.loading.visiable = true;
      this.loading.waiting = false;

      this.$setTimeout(() => {
        this.loading.waiting = true;
      }, 300);
      */
    },
    hideLoading() {
      if (!isBrowser()) {
        return;
      }

      const $ = window.Zepto;
      const $loading = $('#app > .__loading');

      $loading.removeClass('animate enter leave').hide();

      /*
      this.$clearTimeout(this.loading.timeout);

      this.loading.slide = '';
      this.loading.visiable = false;
      this.loading.waiting = false;
      */
    }
  }
};
</script>
