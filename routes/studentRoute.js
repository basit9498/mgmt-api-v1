const express = require("express");
const studentController = require("../controller/studentController");
const { check, body } = require("express-validator");
const isAuth = require("../middleware/is-auth");
const Student = require("../model/studentModel");

const route = express.Router();

// Auth Related
route.post(
  "/login",
  [
    check("email", "Please enter a valid email address")
      .isEmail()
      .normalizeEmail(),
    body("password", "Password Required!").notEmpty(),
  ],
  studentController.studentLogin
);
route.get("/logout", studentController.studentLogout);
route.post(
  "/register",
  [
    check("email")
      .isEmail()

      .withMessage("Please enter a valid email address")
      .normalizeEmail()
      .custom((value, { req }) => {
        return Student.findOne({ email: value }).then((data) => {
          if (data) {
            return Promise.reject(
              "This email is Already exist please try another email !"
            );
          }
        });
      }),
    body("name", "Name should be atleast 3 characters")
      .isLength({ min: 3 })
      .trim(),
    body("password", "Password should atleast 6 character and Alphanumeric")
      .isAlphanumeric()
      .bail()
      .isLength({ min: 6 })
      .bail()
      .notEmpty(),
    body("conformPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password Not Match");
      }
      return true;
    }),
  ],
  studentController.studentRegister
);
route.post("/forget-password", studentController.studentForgetPassword);
route.post("/reset-password/:token", studentController.studentResetPassword);
// Course Action Related
route.put(
  "/course/:id/enroll-request",
  isAuth,
  studentController.studentCourseEnrollRequest
);

module.exports = route;
