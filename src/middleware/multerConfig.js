// multerConfig.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Use the path module to construct the uploads directory path
const uploadPath = process.env.UPLOAD_PATH || 'uploads'; 
const uploadDirectory = path.join(__dirname, uploadPath);

if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory);
  }

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDirectory); // Ensure this directory exists
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage }).single('file');

module.exports = upload;
