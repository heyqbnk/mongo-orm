import {
  ITransformerCtr,
  TBaseType,
  TGetBaseType,
} from './types';
import {
  knownTypeTransformerTuples,
  TScalarTransformerCtr,
  TScalarTransformerTuple
} from './known';
import {Transformer} from './Transformer';
import {TypeBasedParseError} from '../errors';
import {ObjectId} from 'mongodb';
import {TScalarCtr} from '../scalar';

type TBaseTypeTransformer<T extends TBaseType> =
  ITransformerCtr<TGetBaseType<T>, TGetBaseType<T>>;

interface ICreateTransformerOptions<LocalValue, DbValue> {
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
  /**
   * Transformer name.
   */
  name: string;
}

/**
 * Returns Transformer for base type.
 * @param type
 * @param name
 */
export function createBaseTypeTransformer<T extends TBaseType>(
  type: T,
  name: string,
): TBaseTypeTransformer<T> {
  return createTransformerCtr({
    toLocalValue(value: unknown): TGetBaseType<T> {
      if (type === 'Date' || type === 'ObjectId') {
        const Class = type === 'Date' ? Date : ObjectId;

        if (!(value instanceof Class)) {
          throw new TypeBasedParseError(value, type);
        }
      } else {
        if (typeof value !== type) {
          throw new TypeBasedParseError(value, type);
        }
      }
      return value as TGetBaseType<T>;
    },
    toDatabaseValue(value: TGetBaseType<T>): TGetBaseType<T> {
      return value;
    },
    name,
  });
}


/**
 * Возвращает обработчик значения исходя из базового типа.
 * @param type
 */
export function getScalarTransformer<T extends TScalarCtr>(
  type: T
): TScalarTransformerCtr<T> {
  const tuple = knownTypeTransformerTuples
    .find((t): t is TScalarTransformerTuple<T> => t[0] === type);

  if (tuple === undefined) {
    throw new Error('Unable to find Transformer for scalar: ' + type.name);
  }
  return tuple[1] as TScalarTransformerCtr<T>;
}

/**
 * Creates new Transformer.
 * @param options
 */
export function createTransformerCtr<LocalValue, DbValue>(
  options: ICreateTransformerOptions<LocalValue, DbValue>
): ITransformerCtr<LocalValue, DbValue> {
  const {toDatabaseValue, toLocalValue, name} = options;

  class CustomTransformer extends Transformer<LocalValue, DbValue> {
    constructor() {
      super(toLocalValue, toDatabaseValue);
    }
  }

  // Set Transformer class name.
  Object.defineProperty(CustomTransformer, 'name', {value: name});

  return CustomTransformer;
}
