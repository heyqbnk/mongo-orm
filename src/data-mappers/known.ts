import {ObjectId} from 'bson';
import {createDataMapper, createTypeBasedDataMapper} from './utils';
import {TKnownType, TString} from '../types';

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

/**
 * Кортеж, который определяет для какого известного типа какой дата-маппер
 * используется.
 */
export const knownTypeDataMappersTuple = [
  [String, StringDataMapper],
  [Number, NumberDataMapper],
  [Date, DateDataMapper],
  [Boolean, BooleanDataMapper],
  [ObjectId, ObjectIdDataMapper],
] as const;

type TKnownTypeDataMappersTuple = typeof knownTypeDataMappersTuple;

export type TGetKnownTypeDataMapperTuple<T extends TKnownType> =
  TKnownTypeDataMappersTuple[0] extends readonly [infer A, infer B]
    ? A extends T ? [A, B] : never
    : never;

export type TGetKnownTypeDataMapper<T extends TKnownType> =
  TGetKnownTypeDataMapperTuple<T>[1];
