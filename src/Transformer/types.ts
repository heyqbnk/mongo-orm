import {ObjectId} from 'mongodb';
import {TScalarCtr} from '../scalar';
import {TSchemaCtrTransformerCtr} from '../schema';
import {TScalarTransformerCtr} from './known';

/**
 * Transformer which is able to convert value from local to database
 * context and vice versa.
 */
export interface ITransformer<LocalValue, DbValue> {
  /**
   * Converts value from database to local context.
   * @param value
   */
  toLocalValue(value: unknown): LocalValue;
  /**
   * Converts value from local to database context.
   * @param value
   */
  toDatabaseValue(value: LocalValue): DbValue;
}

/**
 * Transformer constructor.
 */
export interface ITransformerCtr<LocalValue, DbValue> {
  new(): ITransformer<LocalValue, DbValue>;
  prototype: ITransformer<LocalValue, DbValue>;
  isTransformer: boolean;
}

/**
 * Returns value Transformer local or database value.
 */
export type ITransformerCtrValue<T, IsLocal extends boolean> =
  T extends ITransformerCtr<infer L, infer D>
    ? IsLocal extends true ? L : D
    : never;

export type TFieldTypeValueTransformerCtr<T> =
  T extends TScalarCtr
    ? TScalarTransformerCtr<T>
    : T extends ITransformerCtr<any, any>
      ? T
      : TSchemaCtrTransformerCtr<T>;

/**
 * Returns value of schema field type.
 */
export type TFieldTypeTransformerCtr<T> =
  T extends [infer U]
    ? TFieldTypeValueTransformerCtr<U>
    : T extends TScalarCtr
      ? TFieldTypeValueTransformerCtr<T>
      : T extends (() => infer U)
        ? U extends [infer K]
          ? TFieldTypeValueTransformerCtr<K>
          : TFieldTypeValueTransformerCtr<U>
        : TFieldTypeValueTransformerCtr<T>;

interface IBaseTypesMapping {
  string: string;
  number: number;
  boolean: boolean;
  Date: Date;
  ObjectId: ObjectId;
}

export type TBaseType = keyof IBaseTypesMapping;
export type TGetBaseType<T extends TBaseType> = IBaseTypesMapping[T];