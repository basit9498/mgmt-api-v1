const TakeCourse = require("../model/takeCourseModel");
const Staff = require("../model/staffModel");

exports.createNewTakeCourse = (req, res, next) => {
  const { course_id, duration, time_from, time_to, start_data, end_date } =
    req.body;
  const course_detail = {
    course_id,
    duration,
    time_from,
    time_to,
    start_data,
    end_date,
  };

  TakeCourse.find({ course_id })
    .then((result) => {
      let addNewCourseStatus = true;
      result?.map((data) => {
        if (data?.course_status) {
          if (
            data?.course_detail?.time_from === time_from &&
            data?.course_detail?.time_to === time_to
          ) {
            var from = new Date(data?.course_detail?.start_data);
            var to = new Date(data?.course_detail?.end_date);

            if (new Date(start_data) >= from && new Date(start_data) <= to) {
              addNewCourseStatus = false;
            }
          }
        }
      });

      if (!addNewCourseStatus) {
        return res.json({
          message: "This Course is Already in Progress in this time",
        });
      }

      const takeCourse = new TakeCourse({
        course_detail,
      });
      takeCourse
        .save()
        .then((result) => {
          res.json({ result });
        })
        .catch((err) => {
          res.json({ err });
        });
    })
    .catch((err) => {
      console.log("err", err);
      res.json({ err });
    });
};

// Assign Teacher
exports.assignTeacherTakeCourse = (req, res, next) => {
  const { c_id, t_id } = req.params;
  Staff.findById(t_id)
    .then((teacher) => {
      if (!teacher) {
        return res.json({
          result: "Teacher Detail Not Founded",
        });
      }
      if (teacher.role !== "TEACHER") {
        return res.json({
          result: "Need only Teacher for this course",
        });
      }

      // Assign before Assign need to check if this course is avaiable  and teacher is assign or not
      TakeCourse.updateOne(
        { _id: c_id },
        {
          $set: {
            "instructor_detail.t_id": t_id,
          },
        }
      )
        .then((result) => {
          return res.json({
            result,
          });
        })
        .catch((err) => {
          return res.json({
            err,
          });
        });
    })
    .catch((err) => {
      res.json({
        err,
      });
    });
};

// Payment Done By => auth [ralated-Teacher,admin]
exports.takeCourseStudentPaymemtDone = (req, res, next) => {
  const { c_id, s_id } = req.params;
  TakeCourse.findById(c_id)
    .then((result) => {
      if (!result) {
        return res.json({
          message: "No Founded Course Detail",
        });
      }

      // Add contion if user can approved then message are come that this student has already pay fee
      result.students.map((data) => {
        if (data.s_id.toString() === s_id) {
          data.fee_pay = data.fee;
          data.allow_status = "APPROVED";
        }
      });

      result
        .save()
        .then((data) => {
          return res.json({
            data,
          });
        })
        .catch((err) => {
          return res.json({
            err,
          });
        });
    })
    .catch((err) => {
      res.json({ err });
    });
};

/**
 * Student Related
 */
// get all Student Request for single auth [ralated-teacher,admin]
exports.takeCourseStudentRequestList = (req, res, next) => {
  const id = req.params.id;
  TakeCourse.findById(id)
    .populate("students.s_id", "name ")
    .then((result) => {
      if (!result) {
        return res.json({
          message: "No Founded Course Detail",
        });
      }

      const student_request_list = result?.students?.filter((data) => {
        if (data.allow_status === "REQUESTED") {
          return data;
        }
      });
      return res.json({
        result: student_request_list,
      });
    })
    .catch((err) => {
      res.json({ err });
    });
};

exports.takeCourseSingleStudentCourseList = (req, res, next) => {
  // We do later
  res.status(200).json({
    student: "Student Course will be avaible latter",
  });
};
