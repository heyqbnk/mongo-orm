import {
  TSupportedType,
  TKnownType,
  IFieldMeta,
  IUnpackedFieldMeta,
} from '../types';
import {ObjectId} from 'mongodb';
import {ReflectUtils} from '../classes';
import {getKnownTypeDataMapper, IDataMapper} from '../data-mappers';

/**
 * Утверждает, что переданное значение является известным типом поля.
 * @param value
 */
export function isKnownType(value: unknown): value is TKnownType {
  return [String, Number, Boolean, Date, ObjectId].includes(value as any);
}

/**
 * Возвращает true в случае, если переданное значение является валидным типом
 * поля.
 * @param value
 */
export function isSupportedType(value: unknown): value is TSupportedType {
  return isKnownType(value) || ReflectUtils.isDataMapper(value);
}

/**
 * Распаковывает поле
 * @param field
 */
export function unpackField(field: IFieldMeta): IUnpackedFieldMeta {
  const {type, ...rest} = field;
  let unpackedType: TSupportedType;
  let isArray = false;

  if (isSupportedType(type)) {
    unpackedType = type;
  } else if (Array.isArray(type)) {
    isArray = true;
    unpackedType = type[0];
  } else {
    const callbackType = type();

    if (Array.isArray(callbackType)) {
      isArray = true;
      unpackedType = callbackType[0];
    } else {
      unpackedType = callbackType;
    }
  }
  return {
    dataMapper: isKnownType(unpackedType)
      ? getKnownTypeDataMapper(unpackedType)
      : unpackedType,
    isArray,
    ...rest,
  };
}