const path = require("path");

const TMP_PATH = "/tmp/geo";
const SRC_PATH = "/app/src";

module.exports = {
  tmp: TMP_PATH,
  tmpZip: path.join(TMP_PATH, "geo.zip"),
  tmpSource: path.join(TMP_PATH, "geo.txt"),
  src: SRC_PATH,
  db: path.join(SRC_PATH, "geo/geo.db"),
};
