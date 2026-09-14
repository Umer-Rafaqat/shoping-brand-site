// Wraps an async controller function. If it throws (or its promise rejects),
// the error is passed to next(err) automatically — Express then routes it to
// the global error handler in server.js. This removes the need for a
// try { ... } catch (err) { res.status(500)... } block in every controller.
const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = catchAsync;
