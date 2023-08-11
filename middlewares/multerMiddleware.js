const multer = require('multer');
const path = require('path');
const tempDir = path.join(__dirname, '../temp'); // Pastikan "/temp"

const diskStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, tempDir);
  },
  filename: (req, file, callback) => {
    callback(null, file.originalname);
  },
  fileFilter: (req, file, callback) => {
    if (
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/jpeg'
    ) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
});

module.exports = multer({ storage: diskStorage }).single('image');
