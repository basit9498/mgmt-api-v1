const express = require("express");
const staffController = require("../controller/staffController");
const { body } = require("express-validator");
const Staff = require("../model/staffModel");

const route = express.Router();

// Staff Register
route.post(
  "/register",
  [
    body("name", `'Name' should atleast 3 characters`)
      .isLength({ min: 3 })
      .trim(),
    body("email", `'Email' is Not Valid `)
      .notEmpty()
      .bail()
      .isEmail()
      .bail()
      .normalizeEmail()
      .custom((value, { req }) => {
        return Staff.findOne({ email: value }).then((staff) => {
          if (staff) {
            return Promise.reject(
              `'Email' This Email is already exist. Please try with another email !`
            );
          }

          return true;
        });
      }),
    body(
      "password",
      `'Password' should be atleast 6 characters and alphanumeric`
    )
      .notEmpty()
      .bail()
      .isAlphanumeric()
      .bail()
      .isLength({ min: 6 })
      .bail(),
    body("conform_password", "'Conform Password' Please Provide")
      .notEmpty()
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Password & Conform Password are not matched");
        }
        return true;
      }),
    body("salary", `'Salary' Please Provide the Salary Detail`).isNumeric(),
    body("role", "Please Provide Role")
      .notEmpty()
      .bail()
      .custom((value, { req }) => {
        const roleData = ["ADMIN", "CASHER", "TEACHER"];
        if (!roleData.includes(value)) {
          throw new Error(
            "'Role' Please Provide the Role & it should be [ADMIN,CASHER,TEACHER]"
          );
        }
        return true;
      }),
  ],
  staffController.registerStaff
);

// Staff login
route.post(
  "/login",
  [
    body("email", `'Email' is Not Valid `)
      .notEmpty()
      .bail()
      .isEmail()
      .bail()
      .normalizeEmail(),
    body(
      "password",
      `'Password' should be atleast 6 characters and alphanumeric`
    ).notEmpty(),
  ],
  staffController.loginStaff
);

// Staff refresh Token
route.post("/refresh-token", staffController.staffRefreshToken);

module.exports = route;
