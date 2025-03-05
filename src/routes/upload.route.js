const express = require('express');
const router = express.Router();
const { uploadController } = require('../controller');
const upload = require('../middleware/multerConfig');


router
    .post('/uploadfile',  uploadController.uploadFile)
    .get('/getImage', uploadController.getImage)

module.exports = router