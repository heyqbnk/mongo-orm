import {createError} from './utils';

interface IConProps {
  Model: Function;
}

export const EmptyFieldsListError = createError<IConProps>(
  'EmptyFieldsListError',
  'Список полей пуст.'
);
