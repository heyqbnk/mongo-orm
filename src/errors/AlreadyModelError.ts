interface IConProps {
  model: Function;
}

export class AlreadyModelError extends Error {
  readonly model: Function;

  constructor(props: IConProps) {
    super('Переданный класс уже объявлен моделью.');
    const {model} = props;
    this.model = model;
    this.name = 'AlreadyModelError';

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AlreadyModelError);
    }
    Object.setPrototypeOf(this, AlreadyModelError.prototype);
  }
}