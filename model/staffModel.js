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
});

module.exports = mongoose.model("Staff", staffSchema);
