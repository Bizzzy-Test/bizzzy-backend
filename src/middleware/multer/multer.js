const path = require("path");
const multer = require("multer");
import fs from "fs";

const uploadDestination = "./uploads/";

if (!fs.existsSync(uploadDestination)) {
  try {
    fs.mkdirSync(uploadDestination, { recursive: true });
  } catch (err) {
    console.error("Error creating directory:", err);
  }
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDestination);
  },
  filename: function (req, file, cb) {
    const extName = path.extname(file.originalname); 
    const fileName =
      file.originalname
        .replace(extName, "")
        .toLowerCase()
        .split(" ")
        .join("-") +
      "-" +
      Date.now();
    cb(null, fileName + extName); 
  },
});

const upload = multer({ storage: storage });

module.exports = upload;