import {TConstructor} from '../types';
import {ReflectUtils, DIUtils} from '../classes';

export function InjectRepository(Model?: TConstructor<any>) {
  return (target: Object, propertyKey: string) => {
    const RepositoryModel = Model === undefined
      ? ReflectUtils.getReflectedType(target, propertyKey)
      : Model;

    if (!DIUtils.isModel(RepositoryModel)) {
      throw new Error('Not a model');
    }
  }
}