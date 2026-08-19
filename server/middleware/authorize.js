const authorize = (...allowedRoleNames) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated." });
    }
    const roleName = req.user.role?.name;
    if (!allowedRoleNames.includes(roleName)) {
      return res
        .status(403)
        .json({ message: "You don't have permission to do that." });
    }
    next();
  };
};

module.exports = { authorize };
