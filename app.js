const express = require("express");
const bodyParse = require("body-parser");
const moogooes = require("mongoose");
const session = require("express-session");
var MongoDBStore = require("connect-mongodb-session")(session);

const studentRoute = require("./routes/studentRoute");
const courseRoute = require("./routes/courseRoute");
const staffRoute = require("./routes/staffRoute");
const courseTakenRoute = require("./routes/takeCourseRoute");

const MONGODB_URI = "mongodb://localhost:27017/mgmt-db";

var store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
});

const app = express();

app.use(bodyParse.urlencoded({ extended: false }));
app.use(bodyParse.json());
app.use(
  session({
    secret: "IUHSBXyuf565$%5HJGSGDJ-&^%KhvAJGDDbasdk",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use("/student", studentRoute);
app.use("/course", courseRoute);
app.use("/staff", staffRoute);
app.use("/course-taken", courseTakenRoute);

app.use((error, req, res, next) => {
  console.log("err-redived", error);
  res.status(500).json({
    error: error,
  });
});

moogooes
  .connect(MONGODB_URI)
  .then((connection) => {
    app.listen(5000);
  })
  .catch((err) => {
    console.log("err", err);
  });
