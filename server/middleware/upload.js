const crypto = require("crypto");
const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: path.join(__dirname, "..", "assets"),
  filename: (req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    callback(null, `${crypto.randomUUID()}${extension}`);
  },
});

const upload = multer({
  storage,

  limits: { fileSize: 5 * 1024 * 1024 },

  fileFilter: (req, file, callback) => {
    console.log("File:", file.originalname);
    console.log("Mimetype:", file.mimetype);

    if (!file.mimetype.startsWith("image/")) {
      return callback(new Error("Only image files are allowed."));
    }

    callback(null, true);
  },

  // fileFilter: (req, file, callback) => {
  //   console.log("File:", file.originalname);
  //   console.log("Mimetype:", file.mimetype);

  //   const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp"];
  //   const extension = path.extname(file.originalname).toLowerCase();

  //   if (
  //     file.mimetype.startsWith("image/") ||
  //     allowedExtensions.includes(extension)
  //   ) {
  //     return callback(null, true);
  //   }

  //   return callback(new Error("Only image files are allowed."));
  // },
});

const normalizeProductArrays = (req, res, next) => {
  for (const field of ["images", "sizes", "colors"]) {
    if (typeof req.body[field] !== "string") continue;
    try {
      const parsed = JSON.parse(req.body[field]);
      req.body[field] = Array.isArray(parsed) ? parsed : [];
    } catch {
      req.body[field] = [];
    }
  }
  next();
};

module.exports = { upload, normalizeProductArrays };
