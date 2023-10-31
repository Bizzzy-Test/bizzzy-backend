const path = require("path");
const multer = require('multer');
// var storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, './public/uploads');

//     },
//     filename: function (req, file, cb) {
//         cb(
//             null,
//             `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
//         );
//     }
// });

const storage = multer.diskStorage({
    destination: './public/uploads', // Where to store the uploaded images
    filename: (req, file, callback) => {
      console.log("-------------------------------------")
      console.log(req.params['user_id'])
      // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const uniqueSuffix = req.params['user_id'];
      callback(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    },
  });
  
const upload = multer({ storage: storage });
module.exports = upload;