import {IFieldMeta} from '../types';
import {createError} from './utils';

interface IConProps {
  currentField: IFieldMeta;
  prevField: IFieldMeta;
}

export const PropertyAlreadyDefinedError = createError<IConProps>(
  'PropertyAlreadyDefinedError',
  'Поле для этого свойства уже объявлено.'
);
