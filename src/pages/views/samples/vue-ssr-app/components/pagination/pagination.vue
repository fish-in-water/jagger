<template>
  <div>
    <div v-if="status == 'loading'" class="ui-loading-wrap wrap">
      <p>请稍候...</p>
      <i class="ui-loading"></i>
    </div>
    <div v-if="status == 'done'" class="ui-loading-wrap wrap">
      没有更多了
    </div>  
    <div v-if="status == 'fail'" class="ui-loading-wrap wrap" @tap="retry">
      出错啦，点击重试
    </div>
  </div>  
  
</template>

<style lang='postcss' scoped>
  .wrap {
    color: #999;
    font-size: 14px;
    height: 60px;
  }
</style>

<script>
import {isBrowser} from '../../../../../helpers/utils';

export default {
  data() {
    return {
      status: 'loading'  // loading, 
    };
  },
  mounted() {
    this.start();
  },
  methods: {
    isVisible() {
      if (!isBrowser()) {
        return false;
      }

      // here i have to use Zepto
      const $ = window.Zepto;
      const {$el} = this;

      // is mounted
      {
        const isMounted = ($el) => {
          if (!$el) {
            return false;
          }

          const nodeName = ($el.nodeName || '').toLowerCase();
          if (nodeName == 'body' || nodeName == 'html') {
            return true;
          }

          return isMounted($el.parentElement);
        };

        if (!isMounted($el)) {
          return false;
        }
      }

      const {top: offsetTop} = $($el).offset();
      const clientHeight = document.documentElement.clientHeight;

      return offsetTop < clientHeight;
    },
    start() {
      this.stop();

      this.$setInterval(() => {
        if (!this.isVisible()) {
          return;
        }

        this.stop();

        this.emit();
      }, 250);
    },
    stop() {
      this.$clearAllIntervals();
    },
    emit() {
      const self = this;
      this.$emit('load', {
        goon() {
          self.status = 'loading';
          self.start();
        },
        finish() {
          self.status = 'done';
          self.stop();
        },
        failure() {
          self.status = 'fail';
          self.stop();
        },
        destroy() {
          self.status = 'destroy';
          self.stop();
        }
      });
    },
    retry() {
      this.emit();
    }
  }
};
</script>
