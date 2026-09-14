const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const User = require("../models/User");
const { verifyAccessToken } = require("../utils/token");

// One generic message for every kind of auth failure (no token, expired
// token, tampered signature, or the user account no longer existing).
// This is intentional: telling a caller exactly *why* a request was
// rejected (e.g. "token expired" vs "invalid signature") leaks details
// about how the token system works, which is useful to an attacker probing
// the API and useless to a legitimate client — either way, the correct
// action is the same: log in again.
const AUTH_ERROR_MESSAGE = "You must be logged in to access this resource.";

const protect = catchAsync(async (req, res, next) => {
  // Browser requests carry the token automatically in the httpOnly cookie.
  // The Authorization header fallback is kept so tools like Postman/cURL
  // (which can't hold an httpOnly cookie a script set) can still be used
  // for manual API testing with a Bearer token.
  const authHeader = req.headers.authorization;
  const bearerToken =
    authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

  const token = req.cookies?.accessToken || bearerToken;

  if (!token) {
    throw new AppError(AUTH_ERROR_MESSAGE, 401);
  }

  let decoded;
  try {
    decoded = verifyAccessToken(token);
  } catch {
    // Covers both an expired token and a tampered/invalid signature —
    // same generic message and status code either way.
    throw new AppError(AUTH_ERROR_MESSAGE, 401);
  }

  const user = await User.findById(decoded.sub).populate("role");
  if (!user) {
    throw new AppError(AUTH_ERROR_MESSAGE, 401);
  }

  req.user = user;
  next();
});

module.exports = { protect };
