import http from '../../../../../helpers/http';
import {getData} from '../../../../../helpers/utils';

export const getWeatherByCity = async (city) => {
  
  const res = await http({
    method: 'get',
    url: `http://restapi.amap.com/v3/weather/weatherInfo?key=162150bdfd5e3e12a2d882272232318b&city=${encodeURIComponent(city)}&output=json`,
  });

  return getData(res, 'data.lives[0]');
};
