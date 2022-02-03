export class TypeBasedParseError extends Error {
  constructor(
    public readonly value: unknown,
    public readonly type: string,
    ) {
    super(`Unable to convert value ${value} to type "${type}"`);
    this.name = 'TypeBasedParseError';

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, TypeBasedParseError);
    }
    Object.setPrototypeOf(this, TypeBasedParseError.prototype);
  }
}