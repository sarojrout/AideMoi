'use strict';

var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./app/routes');
var http = require('http');
var io = require('./app/routes/io.js');

module.exports = function(port) {
  var app = express();
  
  app.use(cookieParser());
  app.use(bodyParser.json());
  
  routes(app);
  
  app.use(express.static('build'));
  
  var server = http.createServer(app);
  io(server);
  
  server.listen(port, function() {
    console.log('Express server listening on port ' + server.address().port);
  });
};