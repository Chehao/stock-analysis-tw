const proxy = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(proxy('/stock', { target: 'https://mis.twse.com.tw', secure: false, logLevel: 'debug', changeOrigin: true }));
};