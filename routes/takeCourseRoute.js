const express = require("express");
const takeCourseController = require("../controller/takeCourseController");
const isAuth = require("../middleware/is-auth");

const route = express.Router();

route.post("/create-new-course", takeCourseController.createNewTakeCourse);

route.put(
  "/:c_id/teacher/:t_id/assign",
  takeCourseController.assignTeacherTakeCourse
);

// get all Student Request for single auth [ralated Teacher,admin]
route.get(
  "/:id/student-request",
  takeCourseController.takeCourseStudentRequestList
);
// Payment Done By => auth [ralated-Teacher,admin]
route.put(
  "/:c_id/student/:s_id/payment-done",
  takeCourseController.takeCourseStudentPaymemtDone
);

route.get(
  "/student/me",
  isAuth,
  takeCourseController.takeCourseSingleStudentCourseList
);

module.exports = route;
