const express = require("express");
const bodyParse = require("body-parser");
const moogooes = require("mongoose");
const path = require("path");
require("dotenv").config();
const studentRoute = require("./routes/studentRoute");
const courseRoute = require("./routes/courseRoute");
const staffRoute = require("./routes/staffRoute");
const courseTakenRoute = require("./routes/takeCourseRoute");
const errorHandler = require("./middleware/error-handler");
// const fileUpload = require("./middleware/file-upload");
const app = express();

app.use("/data", express.static(path.join(__dirname, "data")));
app.use(bodyParse.json()); // for parsing application/json
app.use(bodyParse.urlencoded({ extended: true }));

// app.use(fileUpload.singleImageFileUpload);
// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "OPTIONS, GET, POST, PUT, PATCH, DELETE"
//   );
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
//   next();
// });

app.use("/student", studentRoute);
app.use("/course", courseRoute);
app.use("/staff", staffRoute);
app.use("/course-taken", courseTakenRoute);

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
