import {getWeatherByCity} from '../services/weather';

export default {
  GET_WEATHER_BY_CODE: ({commit, state}, {city}) => {
    return state.weathers[city]
      ? Promise.resolve(state.weathers[city])
      : getWeatherByCity(city).then(weather => commit('SET_WEATHER_BY_CITY', {city, weather}));
  },
};
