export class SourceUnknownError extends Error {
  constructor(public readonly Schema: Function) {
    super(`Repository with passed schema ${Schema.name} has no source.`);
    this.name = 'SourceUnknownError';

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, SourceUnknownError);
    }
    Object.setPrototypeOf(this, SourceUnknownError.prototype);
  }
}