class ValidationError extends Error {
  constructor(errors, cause = null) {
    super(cause);

    this.name = this.constructor.name;
    this.errors = errors;
  }
}

module.exports = ValidationError;
