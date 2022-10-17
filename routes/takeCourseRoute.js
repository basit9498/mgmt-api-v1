const express = require("express");
const takeCourseController = require("../controller/takeCourseController");

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

module.exports = route;
