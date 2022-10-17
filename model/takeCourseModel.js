const mongoose = require("mongoose");

const { Schema } = mongoose;

const takeCourseSchema = new Schema({
  total_seats: {
    type: Number,
    require: true,
    default: 30,
  },
  students: [
    {
      s_id: {
        type: Schema.Types.ObjectId,
        ref: "Student",
      },
      fee: {
        type: Number,
        require: true,
      },
      fee_pay: {
        type: Number,
        require: true,
        default: 0,
      },
      allow_status: {
        type: String,
        enum: ["APPROVED", "REQUESTED", "REJECTED"],
        default: "REQUESTED",
        require: true,
      },
      fee_concession: {
        type: Number,
      },
      fee_concession_commet: {
        type: String,
      },
      report: {
        type: String,
      },
    },
  ],
  instructor_detail: {
    t_id: { type: Schema.Types.ObjectId, ref: "Staff" },
    comment: [
      {
        s_id: { type: Schema.Types.ObjectId, ref: "Student" },
        rates: {
          type: Number,
          default: 0,
        },
        report: {
          type: String,
        },
      },
    ],
  },
  course_detail: {
    course_id: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "Please Provide the Course Id !"],
    },
    duration: {
      type: String,
      required: true,
    },
    time_from: {
      type: String,
      required: true,
    },
    time_to: {
      type: String,
      required: true,
    },
    start_data: {
      type: Date,
      required: true,
    },
    end_date: {
      type: Date,
      required: true,
    },
  },
  course_status: {
    type: Boolean,
    required: true,
    default: true,
  },
});

module.exports = mongoose.model("TakeCourse", takeCourseSchema);
