<template>
  <div>
    <div v-for='value, key in weather' class="ui-row ui-form-item ui-form-item-show ui-border-b">
      <span class="title ui-col ui-col-33">{{key}}</span>
      <span class="value ui-col ui-col-67">{{value}}</span>
    </div>
  </div>  
</template>

<style lang='postcss' scoped> 
  .title {
    color: #999;
  }

  .value {
    color: #333;
  }

</style>

<script>
import {mapState} from 'vuex';

export default {
  data() {
    const {city} = this.$route.query;

    return {
      city
    };
  },
  computed: {
    ...mapState({
      weather(state) {
        return state.weathers[this.city] || {};
      }
    })
  },
  async asyncData({store, route: {query: {city}}}) {
    await store.dispatch('GET_WEATHER_BY_CODE', {city});
  }
};
</script>
