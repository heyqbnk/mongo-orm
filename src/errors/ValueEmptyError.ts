import {IFieldMeta, IUnpackedFieldMeta} from '../types';
import {createError} from './utils';

interface IConProps {
  field: IFieldMeta | IUnpackedFieldMeta;
  document: any;
  documentFieldName: string;
}

export const ValueEmptyError = createError<IConProps>(
  'ValueEmptyError',
  'Значение оказалось пустым.'
);
