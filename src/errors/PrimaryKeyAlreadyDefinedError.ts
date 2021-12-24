import {createError} from './utils';
import {IFieldMeta, IUnpackedFieldMeta} from '../types';

interface IConProps {
  Model: Function;
  currentField: IFieldMeta | IUnpackedFieldMeta;
  prevField: IFieldMeta | IUnpackedFieldMeta;
}

export const PrimaryKeyAlreadyDefinedError = createError<IConProps>(
  'PrimaryKeyAlreadyDefinedError',
  'Ключевое поле уже объявлено.'
);