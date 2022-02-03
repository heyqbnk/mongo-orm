import {TScalarCtr} from '../../scalar';
import {
  ITransformerCtr,
  TScalarValue,
  ITransformerCtrValue
} from '../../Transformer';
import {TTypeOrArrayOrCallback} from '../../types';
import {ISchemaCtr, TSchemaCtrValue} from '../types';

/**
 * Lowest level field types which could be used while creating new schema.
 */
export type TSupportedFieldType =
// Any scalar types: numbers, strings, dates, booleans and other.
  | TScalarCtr
  // Any custom value Transformer.
  | ITransformerCtr<any, any>
  // Any other created schemas.
  | ISchemaCtr<any>;

/**
 * Returns value of supported field type.
 */
export type TSupportedFieldTypeValue<T, IsLocal extends boolean> =
  T extends TScalarCtr
    ? TScalarValue<T, IsLocal>
    : T extends ITransformerCtr<any, any>
      ? ITransformerCtrValue<T, IsLocal>
      : T extends ISchemaCtr<any>
        ? TSchemaCtrValue<T, IsLocal>
        : never;

/**
 * Types, which could be used while creating new schema.
 */
export type TFieldType = TSupportedFieldType extends infer T
  ? T extends any
    ? TTypeOrArrayOrCallback<T>
    : never
  : never;

/**
 * Returns value of schema field type.
 */
export type TFieldTypeValue<T, IsLocal extends boolean> =
  T extends [infer U]
    ? TSupportedFieldTypeValue<U, IsLocal>[]
    : T extends TScalarCtr
      ? TSupportedFieldTypeValue<T, IsLocal>
      : T extends (() => infer U)
        ? U extends [infer K]
          ? TSupportedFieldTypeValue<K, IsLocal>[]
          : TSupportedFieldTypeValue<U, IsLocal>
        : TSupportedFieldTypeValue<T, IsLocal>;
