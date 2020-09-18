const redis = require("../db/redis");

class CacheService {
  buildKey(req, id) {
    const apiVersion = req.apiVersion;
    const user = req.currentUser;

    const key = user ? `${user.id}-${id}` : id;

    return `response-v${apiVersion}-${key}`;
  }

  async get(req, id) {
    const key = this.buildKey(req, id);

    return redis.get(key);
  }

  async set(req, id, body, exp) {
    const key = this.buildKey(req, id);

    return redis.set(key, body, exp);
  }

  async del(req, id) {
    const key = this.buildKey(req, id);

    return redis.del(key);
  }
}

module.exports = new CacheService();
