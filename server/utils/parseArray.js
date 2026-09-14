// Multer sends non-file fields as strings even when the client sent an array
// (e.g. sizes/colors/images as JSON.stringify'd arrays in FormData), while a
// plain JSON request body already gives us a real array. This normalizes both.
const parseArray = (value) => {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

module.exports = { parseArray };
