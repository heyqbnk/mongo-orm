export class DataMapper<LocalValue, DbValue> {
  /**
   * Парсит значение, полученное из БД в локальное значение.
   * @param value
   */
  parse: (value: unknown) => LocalValue;
  /**
   * Парсит локальное значение в значение для БД.
   * @param value
   */
  serialize: (value: LocalValue) => DbValue;

  constructor(
    parse: (value: unknown) => LocalValue,
    serialize: (value: LocalValue) => DbValue,
  ) {
    this.parse = parse;
    this.serialize = serialize;
  }
}