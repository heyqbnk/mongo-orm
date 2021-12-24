import {TSupportedType} from '../../types';
import {isSupportedType} from '../../utils';
import {ReflectUtils} from '../../classes';
import {UnsupportedTypeError} from '../../errors/UnsupportedTypeError';

/**
 * Возвращает валидный для нас тип поля исходя из метаданных типа поля.
 * @param target
 * @param propertyKey
 */
export function getReflectedSupportedType(
  target: Object,
  propertyKey: string,
): TSupportedType {
  const reflectedType = ReflectUtils.getReflectedType(target, propertyKey);

  if (!isSupportedType(reflectedType)) {
    throw new UnsupportedTypeError({
      propertyName: target.constructor.name + '.' + propertyKey,
      type: reflectedType,
    });
  }
  return reflectedType;
}