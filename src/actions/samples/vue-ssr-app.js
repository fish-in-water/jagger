import http from '../../helpers/http';


export default {
  async index({ssr = {}}) {
    return {
      __SSR__: ssr.enable,
      __HTML__: ssr.html,
      __STATE__: JSON.stringify(ssr.state)
    };
  }
};
