import {createError} from './utils';

interface IConProps {
  Model: Function;
}

export const PrimaryKeyNotDefinedError = createError<IConProps>(
  'PrimaryKeyNotDefinedError',
  'Ключевое поле не найдено.'
);