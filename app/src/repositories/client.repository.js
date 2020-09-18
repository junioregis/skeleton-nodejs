const { pg } = require("../db");
const { ClientError } = require("../errors");

const BaseRepository = require("./base.repository");

class ClientRepository extends BaseRepository {
  constructor() {
    super();
  }

  async find(clientId, clientSecret) {
    const cached = await this.cache.get(`client-${clientId}`);

    if (cached) return cached.secret === clientSecret ? cached : null;

    return await pg.transaction(async (transaction) => {
      try {
        const client = await pg.models.clients.findOne({
          raw: true,
          where: {
            id: clientId,
            secret: clientSecret,
          },
          transaction: transaction,
        });

        await this.cache.set(`client-${clientId}`, client, -1);

        return client;
      } catch (e) {
        transaction.rollback();
        throw new ClientError(e);
      }
    });
  }
}

module.exports = new ClientRepository();
