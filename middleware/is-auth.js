module.exports = (req, res, next) => {
  if (!req.session.user) {
    return res.json({
      err: "This Action need Auth",
    });
  }
  next();
};
