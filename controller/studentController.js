const Student = require("../model/studentModel");
const TakeCourse = require("../model/takeCourseModel");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const mailSend = require("../utils/mail-Send");
const { validationResult } = require("express-validator");

exports.studentLogin = (req, res, next) => {
  const { email, password } = req.body;
  Student.findOne({ email: email })
    .then((result) => {
      if (!result) {
        return res.json({
          message: "Please Enter Valid Email & Password",
        });
      }
      bcrypt
        .compare(password, result.password)
        .then((matched) => {
          if (!matched) {
            return res.json({
              message: "Please Enter Valid Email & Password",
            });
          }
          req.session.user = result;
          return res.json({
            message: "User Login",
            result,
          });
        })
        .catch((err) => {
          console.log("Err", err);
        });
    })
    .catch((err) => {
      res.json({
        err,
      });
    });
};
exports.studentLogout = (req, res, next) => {
  req.session.destroy((err) => {
    res.json({
      message: "logout",
    });
  });
};
exports.studentRegister = (req, res, next) => {
  const { name, email, password } = req.body;
  const validatorErrors = validationResult(req);

  if (!validatorErrors.isEmpty()) {
    return res.status(422).json({
      error: validatorErrors.array().map((error) => {
        return { field_name: error.param, error_message: error.msg };
      }),
    });
  }
  bcrypt
    .hash(password, 12)
    .then((encrptPass) => {
      const student = new Student({
        name,
        email,
        password: encrptPass,
      });
      return student.save();
    })
    .then((result) => {
      res.json({
        result,
      });
    })
    .catch((err) => {
      return next(new Error(err));
    });
};
// User Forget Password
exports.studentForgetPassword = (req, res, next) => {
  const { email } = req.body;
  Student.findOne({ email: email })
    .then((result) => {
      if (!result) {
        return res.json({
          message: "Email is Not Founded Please Enter a Register Email!",
        });
      }
      crypto.randomBytes(32, (err, buffer) => {
        if (err) {
          return res.json({
            message: "Please Try Again !",
          });
        }

        const get_token_key = buffer.toString("hex");
        result.token_detail.token_key = get_token_key;
        result.token_detail.token_expire = new Date(
          new Date().getTime() + 2 * 60 * 60 * 1000
        );
        result.token_detail.token_title = "PASSWORD_RESET";
        result.save().then((done) => {
          mailSend(
            email,
            "Password Reset ",
            `Please Click on link to reset Password 
            http://localhost:5000/student/reset-password/${get_token_key}'`
          );
          return res.json({
            done,
            email,
          });
        });
      });
    })
    .catch((err) => {
      res.json({
        err,
      });
    });
};
// Reset Password
exports.studentResetPassword = (req, res, next) => {
  const token = req.params.token;
  const password = req.body.password;
  Student.findOne({
    "token_detail.token_key": token,
    "token_detail.token_title": "PASSWORD_RESET",
    "token_detail.token_expire": { $gt: new Date() },
  })
    .then((result) => {
      if (!result) {
        return res.json({
          err: "Please Try Again ",
        });
      }
      bcrypt
        .hash(password, 12)
        .then((encrptPass) => {
          result;
          result.password = encrptPass;
          result.token_detail.token_key = undefined;
          result.token_detail.token_expire = undefined;
          result.token_detail.token_title = undefined;
          result.save().then((updatePassword) => {
            return res.json({
              updatePassword,
            });
          });
        })
        .catch((err) => {
          res.json({ err });
        });
    })
    .catch((err) => {
      res.json({ err });
    });
};
exports.studentCourseEnrollRequest = (req, res, next) => {
  const c_id = req.params.id;
  // const { s_id } = req.body;
  TakeCourse.findById(c_id)
    .populate("course_detail.course_id")
    .then((result) => {
      if (result?.students.length > 0) {
        const studentIndex = result?.students.findIndex(
          (i) => i.s_id.toString() === req.session.user._id.toString()
        );

        if (studentIndex >= 0) {
          return res.json({
            err: "This Id is Already Add here !",
          });
        }
      }
      TakeCourse.updateOne(
        { _id: c_id },
        {
          $push: {
            students: {
              s_id: req.session.user._id,
              fee: result.course_detail.course_id.course_fee,
            },
          },
        }
      ).then((update) => {
        return res.json({
          update,
        });
      });
    })
    .catch((err) => {
      res.json({
        err: "This Course is no Longer",
      });
    });
};
