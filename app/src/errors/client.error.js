class ClientError extends Error {
  constructor(cause = null) {
    super(cause);

    this.name = this.constructor.name;
  }
}

module.exports = ClientError;
