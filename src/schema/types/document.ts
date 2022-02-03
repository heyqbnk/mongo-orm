import {TMerge, TPartialBy, TUndefinedToOptional} from '../../types';
import {TScalarCtr} from '../../scalar';
import {
  TScalarValue,
  ITransformerCtrValue,
  ITransformerCtr
} from '../../Transformer';
import {ISchemaCtr} from './constructor';
import {TSchemaFieldNames} from './misc';

/**
 * Returns schema fields, which has same local and database field names.
 */
type TNonOverriddenNameKeys<Schema extends object> =
  TSchemaFieldNames<Schema> extends [infer LocalName, infer DbName]
    ? LocalName extends DbName & keyof Schema
      ? LocalName
      : never
    : never;

type TSchemaPropertyValue<Type> =
  Type extends TScalarCtr
    ? TScalarValue<Type, false>
    : Type extends ITransformerCtr<any, any>
      ? ITransformerCtrValue<Type, false>
      : Type extends ISchemaCtr<any, any>
        ? TSchemaDocument<Type['schema']>
        : never;

type TSchemaDocumentType<Type> =
  Type extends [infer U]
    ? TSchemaPropertyValue<U>[]
    : Type extends TScalarCtr
      ? TSchemaPropertyValue<Type>
      : Type extends (() => infer U)
        ? U extends [infer K]
          ? TSchemaPropertyValue<K>[]
          : TSchemaPropertyValue<U>
        : TSchemaPropertyValue<Type>;

/**
 * Returns field value.
 */
type TSchemaDocumentField<Field> = Field extends { type: infer Type }
  ? Field extends { defaultValue: any }
    ? TSchemaDocumentType<Type> | undefined | null
    : (
      | TSchemaDocumentType<Type>
      | (Field extends { nullable: true } ? null : never)
      | (Field extends { optional: true } ? undefined : never)
      )
  : TSchemaDocumentType<Field>;

/**
 * Returns document's part where field names are not overridden.
 */
export type TNameNonOverriddenFragment<Schema extends object> = {
  [Key in TNonOverriddenNameKeys<Schema>]: TSchemaDocumentField<Schema[Key]>;
};

/**
 * Returns document's part where field names are overridden.
 */
export type TNameOverriddenFragment<Schema extends object> =
  TMerge<TSchemaFieldNames<Schema> extends infer Tuple
    ? Tuple extends [infer LocalName, infer DbName]
      ? LocalName extends DbName
        ? never
        : DbName extends string | symbol | number
          ? LocalName extends keyof Schema
            ? { [Field in DbName]: TSchemaDocumentField<Schema[LocalName]> }
            : never
          : never
      : never
    : never>;

/**
 * Returns document field name which is primary.
 */
type TSchemaPrimaryField<Schema extends object> = {
  [Key in keyof Schema]: Schema[Key] extends {primary: true}
    ? Schema[Key] extends {name: string}
      ? Schema[Key]['name']
      : Key
    : never;
}[keyof Schema];

/**
 * Returns schema document interface.
 */
export type TSchemaDocument<Schema extends object> =
  TUndefinedToOptional<TNameNonOverriddenFragment<Schema>
    & TNameOverriddenFragment<Schema>>;

/**
 * Minimal part of document to be used to create schema instance.
 */
export type TSchemaDocumentMinimum<Schema extends object> =
  TPartialBy<TSchemaDocument<Schema>, TSchemaPrimaryField<Schema>>;
