const buildAssetUrl = (req, filename) => {
  if (!filename) return "";
  return `${req.protocol}://${req.get("host")}/assets/${filename}`;
};

module.exports = { buildAssetUrl };
