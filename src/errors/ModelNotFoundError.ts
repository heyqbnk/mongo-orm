import {createError} from './utils';

export const ModelNotFoundError = createError<any>(
  'ModelNotFoundError',
  'Модель не найдена.'
);