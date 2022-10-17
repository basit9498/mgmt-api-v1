const Staff = require("../model/staffModel");
const bcrypt = require("bcryptjs");

module.exports.registerStaff = (req, res, next) => {
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
      staff
        .save()
        .then((result) => {
          res.json({
            result,
          });
        })
        .catch((err) => {
          res.json({
            err,
          });
        });
    })
    .catch((err) => {
      res.json({
        status: false,
        error: "Password is Required !",
      });
    });
};
