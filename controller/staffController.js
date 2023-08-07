const Staff = require("../model/staffModel");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

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

module.exports.loginStaff = async (req, res, next) => {
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

    // Search By Email
    const staff = await Staff.findOne({ email: email }).exec();
    if (!staff) {
      const error = new Error("Invalid Eamil and password!");
      error.status = 404;
      throw error;
    }
    // Compare Password
    const staffMatched = await bcrypt.compare(password, staff.password);
    if (!staffMatched) {
      const error = new Error("Invalid Eamil and password!");
      error.status = 404;
      throw error;
    }

    // Create token and refresh_token
    const token = jwt.sign(
      {
        id: staff._id,
        email: staff.email,
        role: staff.role,
      },
      process.env.JWT_TOKEN_SECRET_KEY,
      { expiresIn: "10h" }
    );

    const refresh_token = jwt.sign(
      {
        id: staff._id,
      },
      process.env.JWT_REFRESH_TOKEN_SECRET_KEY,
      { expiresIn: "5 days" }
    );

    // Update the staff DB
    staff.log_tokens.push({
      login_token: {
        token: token,
        expire_time: new Date(Date.now() + 10 * 60 * 60 * 1000),
      },
      refresh_token: {
        token: refresh_token,
        expire_time: new Date(Date.now() + 120 * 60 * 60 * 1000),
      },
    });

    await staff.save();
    const sendSatffData = {
      name: staff.name,
      email: staff.email,
      role: staff.role,
      _id: staff._id,
    };
    res.status(201).json({
      message: "login successfull",
      staff: sendSatffData,
      refresh_token,
    });
  } catch (error) {
    if (!error.status) {
      error.status = 500;
    }
    next(error);
    return error;
  }
};

module.exports.checkStaffRole = async (req, res, next) => {
  const staff_id = req.staff_id;
  try {
    const staff = await Staff.findById(staff_id);
    if (!staff) {
      const error = new Error("Staff is not find !!!");
      error.status = 404;
      throw error;
    }

    res.status(200).json({ staff_role: staff.role });
  } catch (error) {
    next(error);
  }
};

// Refresh Token for now i am sending with post bosy --> later will se the best Way
exports.staffRefreshToken = async (req, res, next) => {
  try {
    const { refresh_token } = req.body;
    const staff = await Staff.findOne({
      log_tokens: {
        $elemMatch: {
          $and: [
            { "refresh_token.token": refresh_token },
            { "refresh_token.expire_time": { $gt: new Date() } },
          ],
        },
      },
    });

    if (!staff) {
      const error = new Error("Refresh Token Expire please Login Again!");
      error.status = 401;
      throw error;
    }

    const token = jwt.sign(
      {
        id: staff._id.toString(),
        email: staff.email,
        role: staff.role,
      },
      process.env.JWT_TOKEN_SECRET_KEY,
      { expiresIn: "10h" }
    );

    // staff
    staff.log_tokens = staff?.log_tokens?.map((_token) => {
      if (_token?.refresh_token?.token === refresh_token) {
        _token.login_token.token = token;
        _token.login_token.expire_time = new Date(
          Date.now() + 10 * 60 * 60 * 1000
        );
      }
      return _token;
    });

    await staff.save();

    res.status(200).json({
      message: "New Token ",
      token,
    });
  } catch (error) {
    if (!error.status) {
      error.status = 500;
    }
    next(error);
  }
};
