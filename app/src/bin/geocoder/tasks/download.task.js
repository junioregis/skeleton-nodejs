const https = require("https");
const path = require("path");

const { logger, paths } = require("../util");

const { FileUtil } = require("../../../util");

const BASE_URL = "http://download.geonames.org/export/dump";

const REMOTE = {
  all: {
    path: path.join(BASE_URL, "allCountries.zip"),
    entry: "allCountries.txt",
  },
  cities: {
    path: path.join(BASE_URL, "cities500.zip"),
    entry: "cities500.txt",
  },
};

/*
  Output file (geo.db)
    - all:    ~425mb
    - cities: ~7mb
*/
const DOWNLOAD = REMOTE.cities;

function logProgress(current) {
  logger.i(`  Downloading: ${current}%`);
}

module.exports = () => {
  const url = new URL(DOWNLOAD.path);

  const options = {
    method: "GET",
    hostname: url.hostname,
    port: url.port,
    path: `${url.pathname}${url.search}`,
    encoding: "binary",
  };

  return new Promise((resolve, reject) => {
    const request = https.request(options, (incomingMessage) => {
      const bytes = incomingMessage.headers["content-length"];

      var downloaded = 0;
      var progress = 0;

      const response = {
        statusCode: incomingMessage.statusCode,
        headers: incomingMessage.headers,
        body: [],
      };

      logProgress(progress);

      incomingMessage.on("data", (chunk) => {
        const currentProgress = parseInt(
          (Math.round(downloaded * 100) / bytes).toFixed(0)
        );

        if (currentProgress !== progress) {
          progress = currentProgress;
          logProgress(progress);
        }

        downloaded += chunk.length;

        response.body.push(chunk);
      });

      incomingMessage.on("end", async () => {
        if (progress !== 100) {
          logProgress(100);
        }

        const buffer = Buffer.concat(response.body);

        await FileUtil.write(paths.tmpZip, buffer);

        await FileUtil.unzipAndSave(
          paths.tmpZip,
          DOWNLOAD.entry,
          paths.tmpSource
        );

        logger.s(`  > Download success: ${paths.tmpZip}`);

        resolve();
      });
    });

    request.on("error", (error) => {
      logger.s(`  > Fail to download: ${paths.tmpZip}`);

      reject(error);
    });

    request.end();
  });
};
