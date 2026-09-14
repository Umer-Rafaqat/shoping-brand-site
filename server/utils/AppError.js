// A service throws `new AppError("message", statusCode)` whenever business logic
// determines the request can't succeed (not found, duplicate email, wrong password...).
// The controller doesn't need to know these details — it just lets the error
// propagate (via catchAsync) to the global error handler in server.js, which reads
// `.statusCode` and `.message` off this error to build the JSON response.
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // marks this as an "expected" error, not a bug
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
