const fs = require("fs");
const path = require("path");
const pathDir = require("./path-dir");

exports.singleFileDelete = (filePath) => {
  const singleFilePath = path.join(pathDir, filePath);
  fs.unlink(singleFilePath, (err) => {
    if (err) {
      console.log("Err file delete:", err);
    }
    console.log("File delete successfully:");
  });
};
