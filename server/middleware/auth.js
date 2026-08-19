const User = require("../models/User");
const { verifyAccessToken } = require("../utils/token");

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access token missing." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyAccessToken(token);

    const user = await User.findById(decoded.sub).populate("role");

    if (!user) {
      return res.status(403).json({ message: "User no longer exists." });
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Access token expired." });
    }
    return res.status(401).json({ message: "Invalid access token." });
  }
};

module.exports = { protect };
