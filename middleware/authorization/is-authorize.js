const permssions = require("./permissions");

/**
 * V1 Autorize
 */

const isAuthorized = (role) => {
  return (req, res, next) => {
    try {
      if (role.includes(req.user.role)) {
        return next();
      }
      const error = new Error("You are not authorized to access");
      error.status = 401;
      throw error;
    } catch (error) {
      if (!error.status) {
        error.status = 500;
      }
      next(error);
    }
  };
};

module.exports = isAuthorized;
