const path = require("path");
const fs = require("fs");
const { Duplex } = require("stream");
const yauzl = require("yauzl");

class FileUtil {
  constructor() {
    const rootPath = "/app";

    this.uploadsPath = path.join(rootPath, "uploads");
  }

  bufferFromPath(filePath) {
    const data = fs.readFileSync(filePath);

    return Buffer.from(data);
  }

  bufferFromBase64(data) {
    return Buffer.from(data.split(",")[1], "base64");
  }

  bufferFromBinary(data) {
    return Buffer.from(data, "binary");
  }

  async toBuffer(data) {
    const type = data.constructor.name.toLowerCase();

    if (type === "string") {
      return this.bufferFromBase64(data);
    } else if (type === "buffer") {
      return data;
    } else {
      return this.bufferFromBinary(data);
    }
  }

  async write(filePath, content) {
    return new Promise((resolve, reject) => {
      this.createDirFromPath(filePath);

      fs.writeFile(
        filePath,
        content,
        {
          flag: "w",
        },
        (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  }

  async unzip(zipPath, entryName) {
    return new Promise((resolve, reject) => {
      yauzl.open(zipPath, { lazyEntries: true }, (err, zipfile) => {
        if (err) throw err;

        zipfile.on("entry", function (entry) {
          if (/\/$/.test(entry.fileName)) {
            zipfile.readEntry();
          } else {
            zipfile.openReadStream(entry, function (err, readStream) {
              if (err) reject();

              if (entry.fileName === entryName) {
                const chunks = [];

                readStream.on("data", (chunk) => chunks.push(chunk));

                readStream.on("error", reject);

                readStream.on("end", () => {
                  const buffer = Buffer.concat(chunks);

                  resolve(buffer);
                });
              } else {
                readStream.on("end", function () {
                  zipfile.readEntry();
                });
              }
            });
          }
        });

        zipfile.readEntry();
      });
    });
  }

  async unzipAndSave(zipPath, entryName, outPath) {
    const buffer = await this.unzip(zipPath, entryName);

    await this.write(outPath, buffer);
  }

  bufferToStream(buffer) {
    const stream = new Duplex();

    stream.push(buffer);
    stream.push(null);

    return stream;
  }

  exists(path) {
    try {
      return fs.existsSync(path);
    } catch (e) {
      return false;
    }
  }

  createDirFromPath(filePath) {
    const dir = path.dirname(filePath);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
  }
}

module.exports = new FileUtil();
