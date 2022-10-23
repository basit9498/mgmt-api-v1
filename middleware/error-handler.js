module.exports = (error, req, res, next) => {
  const errorsMessage = {};

  if (error.message) {
    errorsMessage.message = error.message;
  } else {
    errorsMessage.message = "Server Error";
  }
  if (error.detail) {
    errorsMessage.detail = error.detail;
  }

  const status = error.status || 500;
  res.status(status).json({
    error: errorsMessage,
  });
};
