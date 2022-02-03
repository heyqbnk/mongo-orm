export class IncorrectSchemaValueError extends Error {
  constructor(
    public readonly Schema: Function,
    public readonly value: unknown,
  ) {
    super('Unable to create schema from value: ' + value);
    this.name = 'IncorrectSchemaValueError';

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, IncorrectSchemaValueError);
    }
    Object.setPrototypeOf(this, IncorrectSchemaValueError.prototype);
  }
}