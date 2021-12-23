import {DataMapper as DecorateDataMapper} from '../decorators';
import {IDataMapper} from './types';
import {ReflectUtils} from '../classes';

interface ITypesMappingMap {
  string: string;
  number: number;
  boolean: boolean;
}

type TBaseType = 'string' | 'number' | 'boolean';

type TTypeBasedType<T extends TBaseType> = ITypesMappingMap[T];

type TTypeBasedDataMapper<T extends TBaseType> =
  IDataMapper<TTypeBasedType<T>, TTypeBasedType<T>>;

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
