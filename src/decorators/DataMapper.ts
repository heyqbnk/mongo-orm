import {ReflectUtils} from '../classes';

/**
 * Помечает сущность как дата-маппер.
 * @constructor
 */
export function DataMapper(): ClassDecorator {
  return target => ReflectUtils.defineDataMapper(target);
}