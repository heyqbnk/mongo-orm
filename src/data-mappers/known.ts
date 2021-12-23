import {ObjectId} from 'bson';
import {createDataMapper, createTypeBasedDataMapper} from './utils';

export const NumberDataMapper = createTypeBasedDataMapper('number');

export const StringDataMapper = createTypeBasedDataMapper('string');

export const BooleanDataMapper = createTypeBasedDataMapper('boolean');

export const DateDataMapper = createDataMapper<Date, Date>(
  value => {
    if (!(value instanceof Date)) {
      throw new Error('Не удалось спарсить значение для типа Date');
    }
    return value;
  },
  value => value,
);

export const ObjectIdDataMapper = createDataMapper<ObjectId, ObjectId>(
  value => {
    if (!(value instanceof ObjectId)) {
      throw new Error('Не удалось спарсить значение для типа ObjectId');
    }
    return value;
  },
  value => value,
);