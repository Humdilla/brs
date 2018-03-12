var router = require('express').Router(),
var jobRouter = require('./jobs').
var webpageRoute = require('./webpage');

router.use('jobs/', jobRouter);

multer = require('multer'),
fs = require('fs'),
util = require('util'),
loki = require('lokijs'),
pug = require('pug'),
diskusage = require('diskusage'),
Readable = require('stream').Readable

mkdir = util.promisify(fs.mkdir);
diskusage.check = util.promisify(diskusage.check);
freadFile = util.promisify(fs.readFile);




// POST '/'

var eStreamClients = {};

var jobs = [];



var renderQueue = [];

var renderNextAnim = function () {
  var job = renderQueue.pop(0);
  if (job === undefined) return;
  console.log('Processing ', job.inputPath);
  job.once('finished', function () {
    console.log('Finished ', job.inputPath);
    renderNextAnim();
  });
  job.start();
};



// GET '/'

var genCompile = function () {
  return freadFile('www/index.pug', 'utf8').then(function (data) {
    return pug.compile(data);
  })
  .catch(function (err) {
    console.log(err.message);
  });
};

var eStreamHandler = function (req, res, next) {
  if (req.header('accept') === 'text/event-stream') {
    eStreamClients[req.ip] = res;
    var client = res;
    client.set({
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache',
      'X-Content-Type-Options': 'nosniff',
      'X-Accel-Buffering': 'no'
    });
    client.setTimeout(0);
    client.status(200);
    client.write('\n');
    client.flushHeaders();
  }
  else
    next();
};

router.get('/', eStreamHandler, function (req, res) {
  diskusage.check(__dirname.split('/')[0]).then(function (info) {
    availableBytes = info.available;
    totalBytes = info.total;
    genCompile().then(function (pugFn) {
      var s = new Readable();
      s._read = function () {}; //noop
      s.push(pugFn({
        availableBytes: availableBytes,
        totalBytes: totalBytes,
        jobs: jobsCollection.find()
      }));
      s.push(null);
      s.pipe(res);
    });
  })
  .catch(function (err) {
    console.log(err.message);
  });
});

// DELETE '/'

router.delete('/', function (req, res) {
  
});

module.exports = router;