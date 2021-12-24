export interface ICtr<Args> {
  new(args: Args): Error & {data: Args};
}

/**
 * Создает класс для кастомной ошибки.
 * @param name
 * @param message
 */
export function createError<Args>(
  name: string,
  message: string,
): ICtr<Args> {
  class CustomError extends Error {
    constructor(readonly data: Args) {
      super(message);
      this.name = name;

      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, CustomError);
      }
      Object.setPrototypeOf(this, CustomError.prototype);
    }
  }

  return CustomError;
}