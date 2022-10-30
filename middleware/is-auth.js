const jwt = require("jsonwebtoken");
module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization");

  if (!authHeader || !authHeader.split(" ")[1]) {
    const error = new Error("Not Authenticated !");
    error.status = 401;
    throw error;
  }

  const getToken = authHeader.split(" ")[1];
  let decodeToken;
  try {
    decodeToken = jwt.verify(getToken, process.env.JWT_TOKEN_SECRET_KEY);
  } catch (error) {
    error.status = 500;
    throw error;
  }

  if (!decodeToken) {
    const error = new Error("Not Authenticated !");
    error.status = 401;
    throw error;
  }

  req.userId = decodeToken.id;
  next();
};
