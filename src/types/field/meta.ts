import {TFieldType} from '../../schema';
import {ITransformer} from '../../Transformer';
import {TOverride} from '../utils';

/**
 * Field meta data.
 */
export interface IFieldMeta {
  /**
   * Class property name, where value should be passed.
   */
  classPropertyName: string;
  /**
   * Name of this property in collection document.
   */
  dbPropertyName: string;
  /**
   * Is it allowed for this value to be null.
   */
  isNullable: boolean;
  /**
   * Is this field primary.
   */
  isPrimary: boolean;
  /**
   * Is it allowed for this value to be missing.
   */
  isOptional: boolean;
  /**
   * Default value, when it is equal to null.
   */
  nullableDefaultValue: any;
  /**
   * Default value, when it is missing.
   */
  optionalDefaultValue: any;
  /**
   * Should value be transformed on set.
   */
  transformOnSet: boolean;
  /**
   * Type which describes, how we should transform field value.
   */
  type: TFieldType;
}

/**
 * Typed variant of field meta.
 */
export type TTypedFieldMeta<Meta extends Partial<IFieldMeta>> =
  TOverride<IFieldMeta, Meta>;

/**
 * Field meta data which is ready to use.
 */
export interface IUnpackedFieldMeta extends Omit<IFieldMeta, 'type'> {
  /**
   * Is this field array.
   */
  isArray: boolean;
  /**
   * Value Transformer of field.
   */
  transformer: ITransformer<any, any>;
}

/**
 * Typed variant of unpacked field meta.
 */
export type TTypedUnpackedFieldMeta<Meta extends Partial<IUnpackedFieldMeta>> =
  TOverride<IUnpackedFieldMeta, Meta>;