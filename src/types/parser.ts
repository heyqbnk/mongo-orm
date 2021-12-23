/**
 * Парсер, который позволяет сериализовать данные из модели в вид, пригодный
 * для документа и наоборот.
 */
export interface IParser<LocalValue, DbValue> {
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