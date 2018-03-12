var express = require('express'),
fs = require('fs'),
util = require('util');

var routers = require('./routes');

process.on('unhandledRejection', function (reason, p) {
  console.log('Unhandled Rejection at : Promise', p, 'reason:', reason);
});

var app = new express();
app.use(express.static('www'));

app.use('/', routers);

app.listen(2000);