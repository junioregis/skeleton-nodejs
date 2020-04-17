class UnauthorizedError extends Error {
  constructor(cause) {
    super(cause);

    this.name = this.constructor.name;
  }
}

module.exports = UnauthorizedError;
