const express = require('express');
const { uploadController } = require('../controller');
const router = express.Router();

router
    .post('/uploadfile', uploadController.uploadFile)
    .get('/getImage', uploadController.getImage)

module.exports = router