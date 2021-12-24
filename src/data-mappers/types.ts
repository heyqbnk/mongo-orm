interface ITypesMappingMap {
  string: string;
  number: number;
  boolean: boolean;
}

export type TBaseType = 'string' | 'number' | 'boolean';
export type TTypeBasedType<T extends TBaseType> = ITypesMappingMap[T];
export type TTypeBasedDataMapper<T extends TBaseType> =
  IDataMapper<TTypeBasedType<T>, TTypeBasedType<T>>;

/**
 * Дата-маппер, который позволяет сериализовать данные из модели в вид,
 * пригодный для документа и наоборот.
 */
export interface IDataMapper<LocalValue, DbValue> {
  /**
   * Парсит значение, полученное из БД в локальное значение.
   * @param value
   */
  parse(value: unknown): LocalValue;
  /**
   * Парсит локальное значение в значение для БД.
   * @param value
   */
  serialize(value: LocalValue): DbValue;
}
