const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const file = require("./file.util");

class ImageUtil {
  static async save(data, filePath) {
    const savePath = path.join(file.uploadsPath, filePath);
    const dir = path.dirname(savePath);

    if (dir !== ".") {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, {
          recursive: true,
        });
      }
    }

    const buffer = await file.toBuffer(data);

    await sharp(buffer)
      .resize(512, 512, {
        fit: sharp.fit.cover,
        withoutEnlargement: true,
      })
      .webp({
        quality: 100,
      })
      .toFile(savePath);
  }
}

module.exports = ImageUtil;
