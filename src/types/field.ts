import {TAnyFieldType, TSupportedType} from './field-type';
import {IDataMapper} from '../data-mappers';

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
  isPrimary: boolean;
  /**
   * Тип, которым описывается указанное поле.
   */
  type: TAnyFieldType;
}

/**
 * Информация о поле, где тип уже не является хуком.
 */
export interface IUnpackedFieldMeta extends Omit<IFieldMeta, 'type'> {
  /**
   * Должно ли это поле быть массивом.
   */
  isArray: boolean;
  /**
   * Маппер-данных.
   */
  dataMapper: IDataMapper<any, any>;
}