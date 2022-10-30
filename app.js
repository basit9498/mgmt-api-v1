const express = require("express");
const bodyParse = require("body-parser");
const moogooes = require("mongoose");
const path = require("path");
// const cookieParser = require("cookie-parser");
require("dotenv").config();

const errorHandler = require("./middleware/error-handler");
// const fileUpload = require("./middleware/file-upload");
const accessHeader = require("./middleware/access-header");

const studentRoute = require("./routes/studentRoute");
const courseRoute = require("./routes/courseRoute");
const staffRoute = require("./routes/staffRoute");
const courseTakenRoute = require("./routes/takeCourseRoute");

const app = express();

// app.use(cookieParser());
app.use("/data", express.static(path.join(__dirname, "data")));
app.use(bodyParse.json()); // for parsing application/json
app.use(bodyParse.urlencoded({ extended: true }));

// app.use(fileUpload.singleImageFileUpload);

app.use(accessHeader);

app.use(`${process.env.API_VERSION}/student`, studentRoute);
app.use(`${process.env.API_VERSION}/course`, courseRoute);
app.use(`${process.env.API_VERSION}/staff`, staffRoute);
app.use(`${process.env.API_VERSION}/course-taken`, courseTakenRoute);

app.use(errorHandler);

moogooes
  .connect(process.env.MONGODB_URI)
  .then((connection) => {
    app.listen(5000, () => {
      console.log("Server Has Been Connected");
    });
  })
  .catch((err) => {
    console.log("err", err);
  });
