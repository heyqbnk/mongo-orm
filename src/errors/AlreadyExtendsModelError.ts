interface IConProps {
  target: Function;
  model: Function;
}

export class AlreadyExtendsModelError extends Error {
  readonly model: Function;
  readonly target: Function;

  constructor(props: IConProps) {
    super('Переданный класс расширяет класс, который уже является моделью.');
    const {target, model} = props;
    this.target = target;
    this.model = model;
    this.name = 'AlreadyExtendsModelError';

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AlreadyExtendsModelError);
    }
    Object.setPrototypeOf(this, AlreadyExtendsModelError.prototype);
  }
}