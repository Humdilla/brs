var router = require('express').Router(),
putRoute = require('./jobPut'),
postRoute = require('./jobPost'),
deleteRoute = require('./jobDelete');

router.use(putRoute);
router.use(postRoute);
router.use(deleteRoute);

module.exports = router;