const AppError = require("../utils/AppError");

const authorize = (...allowedRoleNames) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(
        new AppError("You must be logged in to access this resource.", 401),
      );
    }

    const roleName = req.user.role?.name;
    if (!allowedRoleNames.includes(roleName)) {
      return next(new AppError("You don't have permission to do that.", 403));
    }

    next();
  };
};

module.exports = { authorize };
