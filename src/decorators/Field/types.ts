import {TBoolean, TDate, TFieldType, TNumber, TString} from '../../types';

interface IBaseFieldOptions {
  /**
   * Является ли это поле идентификатором документа.
   * @default false
   */
  id?: boolean;
  /**
   * Значение по умолчанию, если оно отсутствует (равно undefined или null).
   */
  defaultValue?: any;
  /**
   * Наименование этого поля в БД.
   */
  name?: string;
  /**
   * Может ли поле быть пустым.
   */
  nullable?: boolean;
}

type TFieldOptions<Default, Type> = IBaseFieldOptions & {
  /**
   * Тип, который используется при парсинге из БД, а также при сериализации
   * перед её помещением в БД.
   */
  type: TFieldType<Type>;
} & ({
  defaultValue?: Default | null;
  nullable: true;
} | {
  defaultValue?: Default;
  nullable?: false;
});

type TNumberTypeOptions = TFieldOptions<number, TNumber>;
type TStringTypeOptions = TFieldOptions<string, TString>;
type TBooleanTypeOptions = TFieldOptions<boolean, TBoolean>;
type TDateTypeOptions = TFieldOptions<Date, TDate>;

/**
 * Любой допустимый набор настроек, который может быть передан при
 * инициализации поля.
 */
export type TAnyFieldOptions =
  | IBaseFieldOptions
  | TNumberTypeOptions
  | TStringTypeOptions
  | TBooleanTypeOptions
  | TDateTypeOptions;