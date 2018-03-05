<template>
  <transition name="fade">
    <div v-if='visible' class='toast'>
        <p class='text'>
          {{content}}
        </p>
    </div> 
  </transition> 
</template>

<style lang='postcss' scoped>
  .fade-leave-to {
    opacity: 0;
  }

  .fade-leave-active {
    transition: opacity .3s;
  }

  .toast {
    display: flex;
    position: absolute;
    z-index: 10000;
    align-items: center;
    justify-content: center;
    left: 50%;
    bottom: 30%;
    width: 0;
    height: 0;
    text-align: center;

    .text {
      max-width: 240px;
      background-color: rgba(0, 0, 0, 0.6);
      border-radius: 5px;
      padding: 8px 15px;
      color: #fff;
      word-wrap: break-word;
    }
  }
</style>

<script>

export default {
  data() {
    return {
      visible: false,
      text: ''
    };
  },
  methods: {
    show({content = ''} = {}) {
      if (!content) {
        return;
      }

      this.visible = true;
      this.content = content;

      setTimeout(() => {
        this.visible = false;
      }, 3000);
    }
  }
};
</script>
