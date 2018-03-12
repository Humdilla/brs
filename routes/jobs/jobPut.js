var router = require('express').Router(),
multer = require('multer'),
EventEmitter = require('events').EventEmitter,
jobManager = require('./db/job-manager');

var upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'files/blends')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname.replace('.blend', '') + '-' + Date.now() + '.blend')
    }
  }),
  fileFilter: function (req, file, cb) {
    cb(null, file.originalname.endsWith('.blend'));
  }
});

router.put('/', upload.array('files[]'), function (req, res) {
  res.status(200);
  res.send('File received');
  var nFiles = req.files.length;
  for (var i = 0; i < nFiles; i++) {
    jobManager.addJob({
      inputPath: req.files[i].path
    });
  }
});

module.exports = router;