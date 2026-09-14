// Shared by every list endpoint (users, admin products, public products) so the
// page/limit parsing + clamping logic exists in exactly one place.
const getPagination = (req, defaultLimit = 20) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(50, parseInt(req.query.limit, 10) || defaultLimit);
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

module.exports = { getPagination };
