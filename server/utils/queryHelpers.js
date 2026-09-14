// Case-insensitive "contains" search — used identically across users,
// admin products, and public products, so it lives here once.
const searchRegex = (value) => ({ $regex: value, $options: "i" });

// Parses a comma-separated query param into a clean array.
// "red,blue,,green" -> ["red", "blue", "green"]; undefined/"" -> []
const parseCSVParam = (value) => value?.split(",").filter(Boolean) || [];

// Parses a numeric query param, returning undefined (not NaN) when absent —
// so callers can safely do `if (minPrice !== undefined)` without extra checks.
const parseNumberParam = (value) =>
  value !== undefined && value !== "" ? Number(value) : undefined;

// Trims a string query param, safely handling it being absent entirely.
const trimParam = (value) => value?.trim();

module.exports = { searchRegex, parseCSVParam, parseNumberParam, trimParam };
