import multer from "multer";
import config from "config";
import path from "path";

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

export default multer({ storage });
