import {createError} from './utils';

interface IConProps {
  propertyName: string;
  type: any;
}

export const UnsupportedTypeError = createError<IConProps>(
  'UnsupportedTypeError',
  'Данный тип не поддерживается.'
);