export class PrimaryFieldNotFoundError extends Error {
  constructor(
    public readonly Schema: Function,
  ) {
    super('Unable to find primary field in schema: ' + Schema.name);
    this.name = 'PrimaryFieldNotFoundError';

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, PrimaryFieldNotFoundError);
    }
    Object.setPrototypeOf(this, PrimaryFieldNotFoundError.prototype);
  }
}