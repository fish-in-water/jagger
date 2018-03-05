import Vue from 'vue';

export default {
  SET_WEATHER_BY_CITY: (state, {city, weather}) => {
    Vue.set(state.weathers, city, weather);
  },
};
