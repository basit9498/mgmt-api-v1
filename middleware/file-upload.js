const multer = require("multer");

const storageFile = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "data/images");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      new Date().getTime().toString() + "." + file.originalname.split(".")[1]
    );
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg") {
    cb(null, true);
  } else {
    cb(
      new Error(
        `This file "${
          file.originalname.split(".")[1]
        }" extension is not permit to save please upload .jpg`
      )
    );
  }
};

exports.singleImageFileUpload = multer({
  storage: storageFile,
  fileFilter: fileFilter,
}).single("image");
