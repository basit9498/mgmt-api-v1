const express = require("express");
const { check, body } = require("express-validator");
const courseController = require("../controller/courseController");
const fileUpload = require("../middleware/file-upload");

const route = express.Router();

// Add New Course
route.post(
  "/add",
  fileUpload.singleImageFileUpload,
  [
    body("course_id", "course_id atleast 4 Characters")
      .isLength({ min: 4 })
      .trim(),
    body("course_name", "course_name atleast 4 Characters")
      .isLength({ min: 4 })
      .trim(),
    body("course_fee", "course_fee is Required!").isLength({ min: 4 }).trim(),
  ],

  courseController.addNewCourse
);

// Get All Course [pagination,]
route.get("/list", courseController.getAllCourse);

module.exports = route;
