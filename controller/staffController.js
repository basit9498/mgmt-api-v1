const Staff = require("../model/staffModel");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");

module.exports.registerStaff = (req, res, next) => {
  const validErrors = validationResult(req);

  if (!validErrors.isEmpty()) {
    const errorDetail = validErrors.array().map((error) => {
      return error.msg;
    });

    const error = new Error("Input Validation Error");
    error.detail = errorDetail;
    error.status = 422;
    throw error;
  }
  const { name, email, password, salary, role } = req.body;
  bcrypt
    .hash(password, 12)
    .then((encrptPassword) => {
      const staff = new Staff({
        name,
        email,
        password: encrptPassword,
        salary,
        role,
      });
      return staff.save();
    })
    .then((staff) => {
      res.json({
        message: "Staff has been added!",
        staff,
      });
    })
    .catch((err) => {
      next(err);
    });
};
