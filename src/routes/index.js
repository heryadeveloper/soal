const express = require('express');
const mapelRoute = require('./get.route');
const router = express.Router();

router.use('/mapel', mapelRoute);

module.exports = router;