<template>
  <div v-if='visible' class='mask' v-bind:style='{backgroundColor:_bgColor}'>
    <div v-show='loading' class='ui-loading-block show'>
      <div class='ui-loading-cnt'>
          <i class='ui-loading-bright'></i>
          <p>请稍候</p>
      </div>
    </div> 
  </div>
</template>

<style lang='postcss' scoped>
  .mask {
    position: absolute;
    z-index: 10000;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
  }
</style>

<script>

export default {
  props: {
    bgColor: {
      type: String,
      default: 'rgba(0, 0, 0, 0)'
    }
  },
  data() {
    return {
      visible: false,
      loading: false
    };
  },
  computed: {
    _bgColor() {
      return this.bgColor;
    }
  },
  methods: {
    show() {
      if (this.visible) {
        return;
      }

      this.visible = true;
      setTimeout(() => {
        this.loading = true;
      }, 300);
    },
    hide() {
      this.visible = false;
      this.loading = false;
    }
  }

};
</script>
