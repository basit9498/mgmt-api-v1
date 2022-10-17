const Course = require("../model/courseModel");

module.exports.registerNewCourse = (req, res, next) => {
  const { course_id, course_name, course_fee, course_topics, course_detail } =
    req.body;
  const course = new Course({
    course_id,
    course_name,
    course_fee,
    course_topics,
    course_detail,
  });
  course
    .save()
    .then((result) => {
      res.json({
        status: true,
        result,
      });
    })
    .catch((err) => {
      res.json({
        status: false,
        error: err,
      });
    });
};
