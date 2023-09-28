const multer = require("multer");
const config = require("config");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, config.get("inputPath"));
  },
  filename: function (req, file, cb) {
    const extension = file.originalname.match(/[^.]+$/)[0];
    const fileName = Date.now() + "." + extension;
    cb(null, fileName);
  },
});

module.exports = multer({ storage });
