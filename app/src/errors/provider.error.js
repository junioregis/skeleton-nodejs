class ProviderError extends Error {
  constructor(provider, cause = null) {
    super(cause);

    this.name = this.constructor.name;
    this.provider = provider;
  }
}

module.exports = ProviderError;
