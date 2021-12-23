import {TKnownType, IParser} from './types';
import {ObjectId} from 'bson';

/**
 * Создает парсер и регистрирует его.
 * @param parser
 */
export function createParser<LocalValue, DbValue>(
  parser: IParser<LocalValue, DbValue>,
): IParser<LocalValue, DbValue> {
  const {parse, serialize} = parser;

  class Parser {
    static parse = parse;
    static serialize = serialize;
  }

  return Parser;
}

/**
 * Создает стандартный парсер для типа, который можно получить через typeof.
 * @param type
 */
export function createTypeBasedParser<T extends 'string' | 'number' | 'boolean'>(
  type: T,
) {
  return createParser({
    parse: value => {
      if (typeof value !== type) {
        throw new Error(`Не удалось спарсить значение для типа ${type}`);
      }
      return value;
    },
    serialize: value => value,
  });
}

export const NumberParser = createTypeBasedParser('number');
export const StringParser = createTypeBasedParser('string');
export const BooleanParser = createTypeBasedParser('boolean');
export const DateParser = createParser<Date, Date>({
  parse(value: unknown): Date {
    if (!(value instanceof Date)) {
      throw new Error('Не удалось спарсить значение для типа Date');
    }
    return value;
  },
  serialize: value => value,
});
export const ObjectIdParser = createParser<ObjectId, ObjectId>({
  parse(value: unknown): ObjectId {
    if (!(value instanceof ObjectId)) {
      throw new Error('Не удалось спарсить значение для типа ObjectId');
    }
    return value;
  },
  serialize: value => value,
})

/**
 * Возвращает парсер для известного типа поля.
 * @param type
 */
export function geTKnownTypeParser(
  type: TKnownType
): IParser<unknown, unknown> {
  switch (type) {
    case Number:
      return NumberParser;
    case String:
      return StringParser;
    case Date:
      return DateParser;
    case ObjectId:
      return ObjectIdParser;
    default:
      return BooleanParser;
  }
}
