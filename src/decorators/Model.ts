import {ReflectUtils} from '../classes';

/**
 * Декоратор, который помечает класс, как модель представления коллекции БД.
 * @constructor
 * @param collection
 */
export function Model(collection: string): ClassDecorator {
  return target => ReflectUtils.defineModel(target, collection);
}
