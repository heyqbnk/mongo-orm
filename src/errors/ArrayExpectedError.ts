import {createError} from './utils';
import {IFieldMeta, IUnpackedFieldMeta} from '../types';

interface IConProps {
  field: IFieldMeta | IUnpackedFieldMeta;
  value: any;
}

export const ArrayExpectedError = createError<IConProps>(
  'ArrayExpectedError',
  'Ключевое поле уже объявлено.'
);