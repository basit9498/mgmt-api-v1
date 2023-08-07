const pathDir = require("./path-dir");
const fs = require("fs");
const path = require("path");

const accessLogStream = fs.createWriteStream(path.join(pathDir, "access.log"), {
  flags: "a",
});

module.exports = accessLogStream;
