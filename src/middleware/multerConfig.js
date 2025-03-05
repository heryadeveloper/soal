// // multerConfig.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Use the path module to construct the uploads directory path
// const uploadPath = process.env.PATH|| 'upload'; 
const uploadDirectory = path.join(__dirname, '../../upload/');

if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory);
  }

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Simpan sementara di folder temp
    cb(null, path.join(__dirname, '../../upload/temp'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage }).single('file');

module.exports = upload;