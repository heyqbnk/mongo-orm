import {ReflectUtils} from '../classes';

/**
 * Проверяет, все ли переданные значения являются полноценными моделями.
 * @param models
 */
export function validateModels(models: Function[]) {
  if (models.length === 0) {
    return;
  }
  const invalidModels = models
    .filter(m => !ReflectUtils.isCompleteModel(m))
    .map(ctr => ctr.name);

  if (invalidModels.length > 0) {
    // TODO: Ошибка где будут указаны модели.
    throw new Error('Не все модели были зарегистрированы.');
  }
}