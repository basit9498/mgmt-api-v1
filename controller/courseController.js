const Course = require("../model/courseModel");
const { validationResult } = require("express-validator");

exports.addNewCourse = (req, res, next) => {
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

  const imageUrl = req.file;

  if (!imageUrl) {
    const error = new Error("Please attach Image file [.jpg]");
    error.status = 422;
    throw error;
  }

  const { course_id, course_name, course_fee, course_topics, course_detail } =
    req.body;
  const course = new Course({
    course_id,
    course_name,
    course_fee: +course_fee,
    course_topics,
    course_detail,
    course_img: imageUrl.path,
  });
  course
    .save()
    .then((course) => {
      res.json({
        message: "Course Has Been Created !",
        course,
      });
    })
    .catch((error) => {
      error.status = 500;
      next(error);
    });
};

// Get All Course [pagination,]
exports.getAllCourse = (req, res, next) => {
  let COUNT, PER_PAGE, CURRENT_PAGE;

  const { itemPerPage, page } = req.query;

  PER_PAGE = itemPerPage || 3;
  CURRENT_PAGE = page || 1;

  Course.find()
    .countDocuments()
    .then((courseCount) => {
      COUNT = courseCount;
      return Course.find()
        .skip((CURRENT_PAGE - 1) * PER_PAGE)
        .limit(PER_PAGE);
    })
    .then((course) => {
      if (!course) {
        const error = new Error("Course Not Founded!");
        error.status = 404;
        throw error;
      }

      // handling pagination
      const mainHostPath = `http://${req.headers.host}`;
      let next_page_link, previous_page_link;

      // for next link
      if (+CURRENT_PAGE * +PER_PAGE < COUNT) {
        next_page_link = `${mainHostPath}/course/list?itemPerPage=${PER_PAGE}&page=${
          +CURRENT_PAGE + 1
        }`;
      } else {
        next_page_link = null;
      }

      // for prevoius link
      if (+CURRENT_PAGE == 1) {
        previous_page_link = null;
      } else if (+CURRENT_PAGE * +PER_PAGE > COUNT) {
        let update_current_page = COUNT / +PER_PAGE;
        previous_page_link = `${mainHostPath}/course/list?itemPerPage=${PER_PAGE}&page=${
          +update_current_page - 1
        }`;
      } else {
        previous_page_link = `${mainHostPath}/course/list?itemPerPage=${PER_PAGE}&page=${
          +CURRENT_PAGE - 1
        }`;
      }

      res.status(200).json({
        total: COUNT,
        per_page: +PER_PAGE,
        next_page: next_page_link,
        previous_page: previous_page_link,
        course,
      });
    })
    .catch((error) => {
      if (!error.status) {
        error.status = 500;
      }
      next(error);
    });
};
