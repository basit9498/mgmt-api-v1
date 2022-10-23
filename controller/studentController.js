const Student = require("../model/studentModel");
const TakeCourse = require("../model/takeCourseModel");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const mailSend = require("../utils/mail-Send");
const { validationResult } = require("express-validator");

// add new user
exports.studentRegister = (req, res, next) => {
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

  const { name, email, password } = req.body;

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
    .then((student) => {
      res.json({
        message: "Student has been add successfully!",
        student,
      });
    })
    .catch((error) => {
      if (!error.status) {
        error.status = 500;
      }
      next(error);
    });
};
// Student Login
exports.studentLogin = async (req, res, next) => {
  try {
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

    const { email, password } = req.body;

    const student = await Student.findOne({ email: email });

    if (!student) {
      const error = new Error("Please Enter Valid Email & Password");
      error.status = 202;
      throw error;
    }

    const passwordMatched = await bcrypt.compare(password, student.password);

    if (!passwordMatched) {
      const error = new Error("Please Enter Valid Email & Password");
      error.status = 202;
      throw error;
    }

    res.status(200).json({
      message: "User Login",
      student,
    });
  } catch (error) {
    if (!error.status) {
      error.status = 500;
    }
    next(error);
  }
};

exports.studentLogout = (req, res, next) => {
  res.json({
    message: "logout",
  });
};

// User Forget Password send
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

// student Enroll in Course

exports.studentCourseEnrollRequest = (req, res, next) => {
  const c_id = req.params.id;
  const { s_id } = req.body;
  TakeCourse.findById(c_id)
    .populate("course_detail.course_id")
    .then((result) => {
      if (result?.students.length > 0) {
        // Use User token For Now I user s_id i remove the session
        const studentIndex = result?.students.findIndex(
          (i) => i.s_id.toString() === s_id.toString()
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
              s_id: s_id,
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
