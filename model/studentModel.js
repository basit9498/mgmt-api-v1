const mongoose = require("mongoose");

const { Schema } = mongoose;

const studentSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  user_role: {
    role: { type: String, required: true, default: "STUDENT" },
  },

  token_detail: {
    token_key: { type: String },
    token_expire: { type: Date },
    token_title: {
      type: String,
      default: null,
      enum: [null, undefined, "PASSWORD_RESET", "ACCOUNT_VERIFY"],
    },
  },
  log_tokens: [
    {
      login_token: { token: String, expire_time: Date },
      refresh_token: { token: String, expire_time: Date },
      ip_address: {
        type: String,
        default: "postman_login",
      },
    },
  ],
  applications: [
    {
      status_approved: {
        type: Boolean,
        default: false,
        required: true,
      },
      subject: {
        type: String,
        required: true,
      },
      detail: {
        type: String,
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model("Student", studentSchema);
