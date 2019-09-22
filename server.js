'use strict';

const express = require('express');
var httpProxy = require('http-proxy')
var path = require('path')

// Constants
const PORT = 80;
const HOST = '0.0.0.0';
const apiUrl = 'https://mis.twse.com.tw'; //process.env.senna_api_host;
const buildPath = path.join(__dirname, 'build')

// App
const app = express();
const apiProxy = httpProxy.createProxyServer()

app.all('/stock/*', function (req, res) {
  // console.info('redirecting to api proxy', apiUrl, req.originalUrl)
  apiProxy.web(req, res, {target: apiUrl, secure: false, proxyTimeout: 1800000, logLevel: 'debug', changeOrigin: true})
})

apiProxy.on('error', function (error) {
  console.log(error)
})

app.use(express.static(buildPath))

app.get('*', function (req, res) {
  res.sendFile(path.join(buildPath, 'index.html'))
})

app.use(require('compression')())
app.use(require('body-parser').urlencoded({ extended: false }))

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);