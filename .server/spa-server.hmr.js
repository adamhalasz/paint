'use strict';

/**
 * Server dependencies
 */
const express = require('express');
const compression = require('compression');
const logger = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

const server = express();
server.use(compression());
server.use(logger('dev'));

/**
 * HMR support
 */
const webpackConfig = require('../config/webpack.spa.dev.hmr');
const compiler = webpack(webpackConfig);

server.use(webpackDevMiddleware(compiler, {
  noInfo: true,
  publicPath: webpackConfig.output.publicPath,
  stats: {
    colors: true
  }
}));
server.use(webpackHotMiddleware(compiler, {
  log: console.log
}));

/**
 * Parsers for POST data
 */
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({extended: false}));

/**
 * Point static path to `public`
 */
server.use('/', express.static('public', {index: false}));

var fruitNames = ['Apple', 'Orange', 'Banana', 'Mango', 'Kiwi', 'Apricot', 'Avocado', 'Cherry', 'Coconut', 'Fig', 'Grape', 'Pear', 'Peach', 'Lime'];
  var fruits = [];
  var index = 0;
  var len = fruitNames.length;
  var price;

  for (var i = 0; i < 1000; i++) {
    index = Math.floor(Math.random() * len);
    price = Math.floor(Math.random() * 5) + 5; // from $5 - $10
    fruits.push({name: fruitNames[index], price: price});
  }
server.get('/data', function(req, res){
  console.log('Catched GET /data in HMR')
  res.json({
    ok: true,
    name: 'John Doe',
    items: ['knife', 'sword', 'hat', 'rope'],
    fruits: fruits,
    version: 1.0
  })
})

/**
 * Catch all routes and return the `index.html`
 */
server.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

/**
 * Error handlers
 */
// development error handler
// will print stacktrace
if (server.get('env') === 'development') {
  server.use(function(err, req, res) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
server.use(function(err, req, res) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

/**
 * Port & host settings
 */
const PORT = process.env.PORT || 1337;
const HOST = process.env.BASE_URL || 'localhost';
const baseUrl = `http://${HOST}:${PORT}`;

server.set('port', PORT);

/**
 * Begin listening
 */
server.listen(server.get('port'), () => {
  console.log(`Express server listening on ${baseUrl}`);
});

module.exports = server;
