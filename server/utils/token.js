const jwt = require("jsonwebtoken");

const signAccessToken = (userId) =>
  jwt.sign({ sub: userId }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES || "15m",
  });

const verifyAccessToken = (token) =>
  jwt.verify(token, process.env.JWT_ACCESS_SECRET);

const getTokenMaxAgeMs = (token) => {
  const decoded = jwt.decode(token);
  if (!decoded?.exp) return 15 * 60 * 1000; // fallback: 15 minutes
  return decoded.exp * 1000 - Date.now();
};

module.exports = {
  signAccessToken,
  verifyAccessToken,
  getTokenMaxAgeMs,
};
