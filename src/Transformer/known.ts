import {ObjectId} from 'mongodb';
import {createBaseTypeTransformer} from './utils';
import {ITransformerCtrValue} from './types';

export const knownTypeTransformerTuples = [
  [String, createBaseTypeTransformer('string', 'StringTransformer')],
  [Number, createBaseTypeTransformer('number', 'NumberTransformer')],
  [Date, createBaseTypeTransformer('Date', 'DateTransformer')],
  [Boolean, createBaseTypeTransformer('boolean', 'BooleanTransformer')],
  [ObjectId, createBaseTypeTransformer('ObjectId', 'ObjectIdTransformer')],
] as const;

/**
 * Tuples of known scalars.
 */
type TScalarTransformerTuples = typeof knownTypeTransformerTuples;

/**
 * Returns scalar Transformer
 */
export type TScalarTransformerTuple<T> =
  TScalarTransformerTuples extends readonly (infer Tuple)[]
    ? Tuple extends readonly [infer A, infer B]
      ? A extends T
        ? [A, B]
        : never
      : never
    : never;

/**
 * Returns Transformer of scalar type.
 */
export type TScalarTransformerCtr<T> = TScalarTransformerTuple<T>[1];

/**
 * Returns scalar Transformer value.
 */
export type TScalarValue<T, IsLocal extends boolean> =
  ITransformerCtrValue<TScalarTransformerCtr<T>, IsLocal>;