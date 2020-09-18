const multer = require("multer");
const { v4: uuid } = require("uuid");

const FORMATS = ["image/png", "image/jpg", "image/jpeg", "image/webp"];

const FILE_LIMIT = 1 * 1024 * 1024; // 1MB

const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, uuid());
  },
});

const filter = (req, file, cb) => {
  const isAccepted = FORMATS.find((item) => item == file.mimetype);

  if (isAccepted) {
    return cb(null, true);
  }

  return cb(null, false);
};

module.exports = multer({
  storage: storage,
  fileFilter: filter,
  limits: {
    fileSize: FILE_LIMIT,
  },
});
