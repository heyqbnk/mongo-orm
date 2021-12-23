interface IConProps {
  propertyName: string;
  type: any;
}

export class UnsupportedTypeError extends Error {
  readonly type: any;
  readonly propertyName: string;

  constructor(props: IConProps) {
    super('Данный тип не поддерживается.');
    const {propertyName, type} = props;
    this.propertyName = propertyName;
    this.type = type;
    this.name = 'UnsupportedTypeError';

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, UnsupportedTypeError);
    }
    Object.setPrototypeOf(this, UnsupportedTypeError.prototype);
  }
}