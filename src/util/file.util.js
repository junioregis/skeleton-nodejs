const path = require("path");

class FileUtil {
  constructor() {
    const rootPath = path.dirname(
      require.main.filename || process.mainModule.filename
    );

    this.uploadsPath = path.join(rootPath, "uploads");
  }

  async toBuffer(data) {
    const type = data.constructor.name.toLowerCase();

    if (type === "string") {
      return Buffer.from(data.split(",")[1], "base64");
    } else if (type === "buffer") {
      return data;
    } else {
      return Buffer.from(data, "binary").toString("base64");
    }
  }
}

module.exports = new FileUtil();
