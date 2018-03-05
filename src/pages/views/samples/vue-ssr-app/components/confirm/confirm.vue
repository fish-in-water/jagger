<template>
  <div v-if="visible" class="ui-dialog dialog">
    <div class="ui-dialog-cnt" >
      <header v-if="title" class="ui-dialog-hd ui-border-b">
        <h3 >{{title}}</h3>
      </header>
        <div class="ui-dialog-bd">
          <div v-html="content"></div>
        </div>
        <div class="ui-dialog-ft">
          <button v-for="button, index in buttons" :data-index="index" type="button" data-role="button" @tap='onSelect(index)'>
            {{button}}
          </button>
        </div>
    </div>        
  </div>
</template>

<style lang='postcss' scoped>
  .dialog {
    display: -webkit-box;
    word-wrap: break-word;
  }

</style>

<script>
export default {
  data() {
    return {
      visible: false,
      title: '',
      content: '',
      buttons: null,
      resolve: null,
      reject: null
    };
  },
  methods: {
    onSelect(index) {
      this.visible = false;

      this.resolve({index});
    },
    async show({
      title = '',
      content = '',
      buttons = ['确定']
    }) {
      this.visible = true;
      this.title = title;
      this.content = content;
      this.buttons = buttons;

      return new Promise((resolve) => {
        this.resolve = resolve;
      });
    }
  }
};
</script>
