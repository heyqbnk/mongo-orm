import {TScalarCtr} from '../../scalar';
import {
  TScalarValue,
  ITransformerCtrValue,
  ITransformerCtr
} from '../../Transformer';
import {ISchemaCtr} from './constructor';
import {TPartialBy, TUndefinedToOptional} from '../../types';

type TSchemaPropertyValue<Type> =
  Type extends TScalarCtr
    ? TScalarValue<Type, true>
    : Type extends ITransformerCtr<any, any>
      ? ITransformerCtrValue<Type, true>
      : Type extends ISchemaCtr<any, any>
        ? TSchemaProperties<Type['schema']>
        : never;

type TSchemaProperty<Type> =
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
 * Returns schema field name which is primary.
 */
type TSchemaPrimaryField<Schema extends object> = {
  [Key in keyof Schema]: Schema[Key] extends {primary: true}
    ? Key
    : never;
}[keyof Schema];

/**
 * Returns description of schema properties which should be in its instance.
 */
export type TSchemaProperties<Schema extends object> = TUndefinedToOptional<{
  [Key in keyof Schema]:
  Schema[Key] extends { type: infer Type }
    ? Schema[Key] extends { defaultValue: any }
      ? TSchemaProperty<Type>
      : (
        | TSchemaProperty<Type>
        | (Schema[Key] extends { nullable: true } ? null : never)
        | (Schema[Key] extends { optional: true } ? undefined : never)
        )
    : TSchemaProperty<Schema[Key]>;
}>;

/**
 * Minimal part of schema to be used to create schema instance.
 */
export type TSchemaPropertiesMinimum<Schema extends object> =
  TPartialBy<TSchemaProperties<Schema>, TSchemaPrimaryField<Schema>>;
