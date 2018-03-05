const env = process.env.NODE_ENV || 'production';
const test = process.env.TEST_ENV || '';

module.exports = {

  ...{
    // dev
    dev: {
      
    },

    // production
    production: {
      
    }
  }[test || env]
};
