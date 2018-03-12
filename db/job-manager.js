var childProcess = require('child_process'),
util = require('util'),
fs = require('fs'),
chokidar = require('chokidar');

var rmdir = util.promisify(fs.rmdir);
var unlink = util.promisify(fs.unlink);

var Job = function (model) {
  this.model = model;
  this.process = null;
};
Job.prototype = new EventEmitter;
Job.prototype.start = function () {
  var self = this;
  this.process = childProcess.spawn('C:/Program Files/Blender Foundation/Blender/blender.exe', [
    '-b',
    this.model.inputPath,
    '-E',
    'BLENDER_RENDER',
    '-o',
    this.model.outputPath,
    '-F',
    'PNG',
    '-a'
  ], {
    stdio: 'ignore'
  });
  this.model.status = 'Rendering';
  this.process.once('exit', function (code, signal) {
    if (code === 0) {
      Object.keys(eStreamClients).forEach(function (k) {
        eStreamClients[k].write('event: RenderComplete\n');
        eStreamClients[k].write('data: '+ self.model.$loki + '\n\n');
        eStreamClients[k].flushHeaders();
      });
      self.emit('finished', self.outputPath);
      self.model.status = 'Finished';
    }
    else {
      var err = new Error('Process exited with signal ' + signal);
      err.code = code;
      self.emit('error', err);
    }
    if (renderQueue.length > 0)
      renderNextAnim();
  });
  this.process.once('error', function (err) {
    self.emit('error', err);
  });
};
Job.prototype.cancel = function () {
  this.process.removeAllListeners('exit');
  this.process.removeAllListeners('error');
  this.process.kill('SIGKILL');
  this.process = null;
};
Job.prototype.pause = function () {
  this.process.kill('SIGSTOP');
};
Job.prototype.resume = function () {
  this.process.kill('SIGCONT');
};

var Job = function (model) {
  this.model = model;
  this.process = null;
};
Job.prototype = new EventEmitter;
Job.prototype.start = function () {
  var self = this;
  this.process = childProcess.spawn('C:/Program Files/Blender Foundation/Blender/blender.exe', [
    '-b',
    this.model.inputPath,
    '-E',
    'BLENDER_RENDER',
    '-o',
    '//'+this.model.outputPath,
    '-F',
    'PNG',
    '-a'
  ], {
    stdio: 'ignore'
  });
  this.model.status = 'Rendering';
  this.process.once('exit', function (code, signal) {
    if (code === 0) {
      Object.keys(eStreamClients).forEach(function (k) {
        eStreamClients[k].write('event: RenderComplete\n');
        eStreamClients[k].write('data: '+ self.model.$loki + '\n\n');
        eStreamClients[k].flushHeaders();
      });
      self.emit('finished', self.outputPath);
      self.model.status = 'Finished';
    }
    else {
      var err = new Error('Process exited with signal ' + signal);
      err.code = code;
      self.emit('error', err);
    }
    if (renderQueue.length > 0)
      renderNextAnim();
  });
  this.process.once('error', function (err) {
    self.emit('error', err);
  });
};
Job.prototype.cancel = function () {
  this.process.removeAllListeners('exit');
  this.process.removeAllListeners('error');
  this.process.kill('SIGKILL');
  this.process = null;
};
Job.prototype.pause = function () {
  this.process.kill('SIGSTOP');
};
Job.prototype.resume = function () {
  this.process.kill('SIGCONT');
};

var jobsCollection = db.getCollection('jobs');
var renderOrderCollection = db.getCollection('renderOrder');
var renderOrderView = renderOrderCollection.getDynamicView('renderOrder');

var JobManager = function () {
  this.renderQueue = [];
  // Populate renderQueue with jobs stored in database
  renderOrderView.applySimpleSort('order', {
    persistent: true
  }).data().forEach(function (job) {
    this.renderQueue.push(new Job(job));
  });
};
JobManager.prototype = new Object;
JobManager.prototype.addJob = function (opts) {
  var inputPath = upath.normalize(opts.inputPath);
  var jobDoc = jobsCollection.insert({
    filename: req.files[i].originalname,
    inputPath: inputPath,
    outputPath: '../renders/'+inputPath.split('/').pop().replace('.blend', '/'),
    status: 'uploaded',
    order: opts.index || jobsCollection.count()
  });
  return jobDoc;
};
JobManager.prototype.changeJobIndex = function (id, index) {
  jobsCollection.get(id).order = index;
};
JobManager.prototype.deleteJob = function (id) {
  var job = jobsCollection.remove(id);
  // Remove files from filesystem
  return Promise.all([
    unlink(job.inputPath),
    rmdir(job.outputPath)
  ]).catch(function (err) {
    console.log(err);
  });
};