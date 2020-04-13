const ssh = require("ssh2");
const logger = require("./logger");

async function exec(cmd, config, options = {}) {
  const client = new ssh.Client();

  return new Promise((resolve, reject) => {
    var stdout = "";

    client.on("ready", function () {
      logger.i(`[cmd] ${cmd}`, { space: 2 });

      var command;

      if (typeof options.cwd !== "undefined") {
        command = `cd ${options.cwd} && ${cmd}`;
      } else {
        command = cmd;
      }

      client.exec(command, function (err, stream) {
        if (err) {
          reject(err);
        }

        stream
          .on("close", function (code, signal) {
            const result = {
              success: code === 0,
              code: code,
              stdout: stdout === "" ? null : stdout,
            };

            client.end();

            resolve(result);
          })
          .on("data", function (data) {
            stdout = data.toString().trim();

            logger.d(stdout, { space: 4 });
          })
          .stderr.on("data", function (data) {
            stdout = data.toString().trim();

            logger.d(stdout, { space: 4 });
          });
      });
    });

    const conn = {
      host: config.host,
      port: config.port,
      username: config.user,
      privateKey: config.key,
    };

    client.connect(conn);
  });
}

module.exports = {
  exec,
};
