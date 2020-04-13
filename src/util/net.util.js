const https = require("https");

async function get(url, params) {
  if (typeof params !== "undefined") {
    params = toUrlParams(params);
    url = `${url}?${params}`;
  }

  return request("GET", url);
}

async function request(method, url, body = null) {
  url = new URL(url);

  const options = {
    method: method.toUpperCase(),
    hostname: url.hostname,
    port: url.port,
    path: `${url.pathname}${url.search}`,
    encoding: "binary"
  };

  if (body) {
    options.headers["Content-Length"] = Buffer.byteLength(body);
  }

  return new Promise((resolve, reject) => {
    const request = https.request(options, incomingMessage => {
      const response = {
        statusCode: incomingMessage.statusCode,
        headers: incomingMessage.headers,
        body: []
      };

      incomingMessage.on("data", chunk => {
        response.body.push(chunk);
      });

      incomingMessage.on("end", () => {
        const buffer = Buffer.concat(response.body);

        response.body = buffer;

        try {
          response.body = JSON.parse(buffer.toString("utf8"));
        } catch (e) {}

        resolve(response);
      });
    });

    request.on("error", error => {
      reject(error);
    });

    if (body) {
      request.write(body);
    }

    request.end();
  });
}

function toUrlParams(params) {
  return Object.entries(params)
    .map(([k, v]) => `${k}=${v}`)
    .join("&");
}

module.exports = {
  get
};
