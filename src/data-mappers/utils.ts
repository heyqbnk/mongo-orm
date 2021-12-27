import {TBaseType, TTypeBasedType} from './types';
import {TKnownType} from '../types';
import {
  knownTypeDataMappersTuple,
  TGetKnownTypeDataMapper,
  TGetKnownTypeDataMapperTuple,
} from './known';
import {DataMapper} from './DataMapper';

/**
 * Создает стандартный парсер для типа, который можно получить через typeof.
 * @param type
 */
export function createTypeBasedDataMapper<T extends TBaseType>(
  type: T,
): DataMapper<TTypeBasedType<T>, TTypeBasedType<T>> {
  return new DataMapper(
    (value: unknown): TTypeBasedType<T> => {
      if (typeof value !== type) {
        throw new Error(`Не удалось спарсить значение для типа ${type}`);
      }
      return value as TTypeBasedType<T>;
    },
    value => value,
  );
}

/**
 * Возвращает дата-мапперр исходя из известного типа.
 * @param type
 */
export function getKnownTypeDataMapper<T extends TKnownType>(
  type: T
): TGetKnownTypeDataMapper<T> {
  const tuple = knownTypeDataMappersTuple.find((t): t is TGetKnownTypeDataMapperTuple<T> => t[0] === type);

  if (tuple === undefined) {
    throw new Error('Информация о подходящем маппере не найдена.');
  }
  return tuple[1];
}