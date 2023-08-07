const mongoose = require("mongoose");

const { Schema } = mongoose;

const staffSchema = new Schema({
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
  salary: {
    type: Number,
    required: true,
    default: 0,
  },
  role: {
    type: String,
    required: true,
    enum: {
      values: ["ADMIN", "CASHER", "TEACHER"],
      message: "{VALUE} is not such a role",
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
});

module.exports = mongoose.model("Staff", staffSchema);
