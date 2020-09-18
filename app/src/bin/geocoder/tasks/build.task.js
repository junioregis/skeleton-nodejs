const fs = require("fs");
const readline = require("readline");

const { logger, paths } = require("../util");

function logProgress(current) {
  logger.i(`  Building: ${current}%`);
}

module.exports = () => {
  return new Promise((resolve, reject) => {
    try {
      var stats = fs.statSync(paths.tmpSource);
      var totalBytes = stats["size"];
      var progress = 0;
      var lines = 0;
      var bytesRead = 0;

      logProgress(progress);

      fs.writeFileSync(paths.db, "", "utf8");

      const reader = readline.createInterface({
        input: fs.createReadStream(paths.tmpSource),
      });

      reader.on("line", (line) => {
        if (line) {
          const cols = line.split(/\t/);

          // City, Latitude, Longitude, Country
          const row = [cols[1], cols[8], cols[4], cols[5]].join("|");

          fs.appendFileSync(paths.db, `${row}\n`, "utf8");

          const bytes = Buffer.byteLength(line, "utf8");

          const currentProgress = parseInt(
            (Math.round(bytesRead * 100) / totalBytes).toFixed(0)
          );

          if (currentProgress !== progress) {
            progress = currentProgress;
            logProgress(progress);
          }

          bytesRead += bytes;
          lines++;
        }
      });

      reader.on("close", (line) => {
        if (progress !== 100) {
          logProgress(100);
        }

        logger.s(`  > Build success from source: ${paths.tmpSource}`);
        logger.s(`  > ${lines} locations stored: ${paths.db}`);

        resolve();
      });
    } catch (e) {
      logger.s(`  > Fail to build: ${paths.tmpSource}`);

      reject(e);
    }
  });
};
