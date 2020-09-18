const redis = require("redis");

const config = require("../../config");

class Redis {
  async connect() {
    return new Promise((resolve, reject) => {
      this.client = redis.createClient(config.redis.port, config.redis.host);

      this.client.on("connect", () => {
        this.client.flushall((err, succeeded) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });

      this.client.on("error", (err) => {
        reject(err);
      });
    });
  }

  async get(key) {
    return new Promise((resolve, reject) => {
      this.client.get(key, (error, result) => {
        if (error) reject(error);

        if (result) {
          try {
            result = JSON.parse(result);
          } catch (e) {
            // Ignore
          }
        }

        try {
          resolve(result);
        } catch (e) {
          reject(e);
        }
      });
    });
  }

  async set(key, val, exp) {
    return new Promise((resolve, reject) => {
      try {
        try {
          val = JSON.stringify(val);
        } catch (e) {
          // Ignore
        }

        if (exp > 0) {
          this.client.set(key, val, "EX", exp, (error) => {
            if (error) reject(error);

            resolve();
          });
        } else {
          this.client.set(key, val, (error) => {
            if (error) reject(error);

            resolve();
          });
        }
      } catch (e) {
        reject(e);
      }
    });
  }

  async del(key) {
    return new Promise((resolve, reject) => {
      try {
        this.client.del(key);
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  }
}

module.exports = new Redis();
