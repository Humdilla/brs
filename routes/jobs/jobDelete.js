var router = require('express').Router(),
multer = require('multer'),
jobManager = require('./db/job-manager');

var upload = multer();

router.delete('/', upload.none(), function (req, res) {
  res.status(200);
  res.send('File deleted.');
  console.log('Deleting job ', req.body.id);
});