const express = require("express");
const courseController = require("../controller/courseController");
const route = express.Router();

route.post("/register", courseController.registerNewCourse);

module.exports = route;
