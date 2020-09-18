const { pg, redis } = require("../db");

class RepositoryCache {
  buildKey(id) {
    return `repository-${id}`;
  }

  async set(id, val, exp) {
    const key = this.buildKey(id);

    await redis.set(key, val, exp);
  }

  async get(id) {
    const key = this.buildKey(id);

    return redis.get(key);
  }

  async del(id) {
    const key = this.buildKey(id);

    return redis.del(key);
  }
}

class BaseRepository {
  constructor() {
    this.cache = new RepositoryCache();
  }
}

module.exports = BaseRepository;
