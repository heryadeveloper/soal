const express = require('express');
const mapelRoute = require('./get.route');
const uploadFile = require('./upload.route');
const router = express.Router();

router.use('/mapel', mapelRoute);
router.use('/file', uploadFile);

module.exports = router;