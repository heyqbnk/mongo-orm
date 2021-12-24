import {createError} from './utils';
import {IFieldMeta} from '../types';

interface IConProps {
  Model: Function;
}

export const PrimaryKeyNotDefinedError = createError<IConProps>(
  'PrimaryKeyNotDefinedError',
  'Ключевое поле не найдено.'
);