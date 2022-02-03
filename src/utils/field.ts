import {
  IFieldMeta,
  IUnpackedFieldMeta,
} from '../types';
import {TScalarCtr} from '../scalar';
import {ObjectId} from 'mongodb';
import {
  createTransformerCtr,
  getScalarTransformer,
  ITransformer,
  ITransformerCtr,
} from '../Transformer';
import {
  ISchemaCtr, TSchema,
  TSchemaDocument,
  TSupportedFieldType
} from '../schema';

/**
 * States that value is scalar type.
 * @param value
 */
export function isScalarCtr(value: unknown): value is TScalarCtr {
  return value === String || value === Number || value === Boolean ||
    value === Date || value === ObjectId;
}

/**
 * States that value is schema supported field type.
 * @param value
 */
export function isSupportedFieldType(
  value: unknown
): value is TSupportedFieldType {
  return isScalarCtr(value) || isTransformerCtr(value) || isSchemaCtr(value);
}

/**
 * States that value has shape of value processor.
 * @param value
 */
export function isTransformerCtr(value: unknown): value is ITransformerCtr<any, any> {
  return typeof value === 'function' && 'isTransformer' in value;
}

/**
 * States that value is schema constructor.
 * @param value
 */
export function isSchemaCtr(value: unknown): value is ISchemaCtr<any> {
  return typeof value === 'function' && 'schema' in value;
}

/**
 * Unpacks field getting it real type and compatible value processor.
 * @param field
 */
export function unpackFieldMeta(field: IFieldMeta): IUnpackedFieldMeta {
  const {type: fieldType, ...rest} = field;
  let type: TSupportedFieldType;
  let isArray = false;

  if (isSupportedFieldType(fieldType)) {
    type = fieldType;
  } else if (Array.isArray(fieldType)) {
    isArray = true;
    type = fieldType[0];
  } else {
    const unpackedType = typeof fieldType === 'function'
      ? fieldType()
      : fieldType;

    if (Array.isArray(unpackedType)) {
      isArray = true;
      type = unpackedType[0];
    } else {
      type = unpackedType;
    }
  }
  let transformer: ITransformer<any, any>;

  // In case, scalar type is passed, return its Transformer and create its
  // instance.
  if (isScalarCtr(type)) {
    transformer = new (getScalarTransformer(type));
  }
  // Transformer passed. Create its instance.
  else if (isTransformerCtr(type)) {
    transformer = new type;
  }
    // Otherwise, schema constructor was passed. Create new Transformer which
  // refers to schema methods.
  else {
    const Schema = type;
    type Schema = typeof Schema;
    const Transformer = createTransformerCtr<TSchema<Schema['schema']>,
      TSchemaDocument<Schema['schema']>>({
      toLocalValue: value => new Schema(value, 'unknown'),
      toDatabaseValue: schema => schema.toDocument(),
      name: Schema.name + 'Transformer',
    });

    transformer = new Transformer();
  }

  return {transformer, isArray, ...rest};
}