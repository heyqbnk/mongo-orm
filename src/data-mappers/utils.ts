import {DataMapper as DecorateDataMapper} from '../decorators';
import {
  IDataMapper,
  TBaseType,
  TTypeBasedDataMapper,
  TTypeBasedType,
} from './types';
import {ReflectUtils} from '../classes';
import {TKnownType} from '../types';
import {
  knownTypeDataMappersTuple,
  TGetKnownTypeDataMapper,
  TGetKnownTypeDataMapperTuple,
} from './known';

/**
 * Создает стандартный парсер для типа, который можно получить через typeof.
 * @param type
 */
export function createTypeBasedDataMapper<T extends TBaseType>(
  type: T,
): TTypeBasedDataMapper<T> {
  return createDataMapper(
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
 * Создаёт новый дата-маппер.
 * @param parse
 * @param serialize
 */
export function createDataMapper<LocalValue, DbValue>(
  parse: (value: unknown) => LocalValue,
  serialize: (value: LocalValue) => DbValue,
): IDataMapper<LocalValue, DbValue> {
  @DecorateDataMapper()
  class DataMapper {
    static parse = parse;
    static serialize = serialize;
  }
  return DataMapper;
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