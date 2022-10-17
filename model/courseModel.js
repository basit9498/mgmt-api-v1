const mongoose = require("mongoose");

const { Schema } = mongoose;

const courseSchema = new Schema({
  course_id: {
    type: String,
    required: true,
  },
  course_name: {
    type: String,
    required: true,
  },
  course_fee: {
    type: Number,
    required: true,
  },

  course_topics: {
    type: [String],
  },
});

module.exports = mongoose.model("Course", courseSchema);
