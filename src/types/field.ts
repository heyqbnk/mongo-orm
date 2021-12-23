import {TAnyFieldType, TSupportedType} from './field-type';

export interface IFieldMeta {
  /**
   * Наименование свойства в классе.
   */
  classPropertyName: string;
  /**
   * Наименование свойства в БД.
   */
  dbPropertyName: string;
  /**
   * Значение по умолчанию, в случае если в поле записано null или undefined.
   */
  defaultValue?: any;
  /**
   * Может ли поле быть пустым.
   */
  isNullable: boolean;
  /**
   * Является ли поле уникальным идентификатором этой модели.
   */
  isIdentifier: boolean;
  /**
   * Тип, которым описывается указанное поле.
   */
  type: TAnyFieldType;
}

/**
 * Информация о поле, где тип уже не является хуком.
 */
export interface IUnpackedFieldMeta extends Omit<IFieldMeta, 'type'> {
  type: TSupportedType;
  /**
   * Должно ли это поле быть массивом.
   */
  isArray: boolean;
}