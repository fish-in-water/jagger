<template>
  <div class="cities">
    <div class="summary">
      {{weather.city}}, 
      {{weather.weather}}, 
      {{weather.temperature}}°C, 
      {{weather.winddirection}}风, 
      {{weather.windpower}}级,
      湿度{{weather.humidity}}%
    </div>  
    <div class="recommends">
      <button class='ui-btn city' v-for='city in cities' @tap='goWeather(city)'>
        {{city}}
      </button>
    </div>
  </div>  
</template>

<style lang='postcss' scoped> 
  .cities {
    padding: 20px;

    .summary {
      color: #00a5e0;
    }

    .recommends {
      margin-top: 10px;
    }

    .city:nth-child(n + 2) {
      margin-left: 10px;
    }
  }
</style>

<script>
import {mapState} from 'vuex';
import {tgtRoute} from '../../../../../../helpers/utils';

export default {
  data() {
    return {
      cities: [
        '北京',
        '上海',
        '广州',
        '深圳'
      ]
    };
  },
  computed: {
    ...mapState({
      weather(state) {
        return state.weathers['上海'] || {};
      }
    })
  },
  methods: {
    goWeather(city) {
      this.$router.push(tgtRoute(`/samples/vue-ssr-app/weather?city=${city}`));
    }
  },
  async asyncData({store}) {
    await store.dispatch('GET_WEATHER_BY_CODE', {city: '上海'});
  }
};
</script>
