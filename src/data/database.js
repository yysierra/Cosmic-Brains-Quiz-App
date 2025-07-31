// Configuration settings
const config = {
  development: {
    port: process.env.PORT || 3000,
    sessionTimeout: 60 * 60 * 1000, // 1 hour
  },
  production: {
    port: process.env.PORT || 8080,
    sessionTimeout: 30 * 60 * 1000, // 30 minutes
  }
};

const environment = process.env.NODE_ENV || 'development';

module.exports = config[environment];