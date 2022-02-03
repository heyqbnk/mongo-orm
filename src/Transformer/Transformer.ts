import {ITransformer} from './types';

export class Transformer<LocalValue, DbValue>
  implements ITransformer<LocalValue, DbValue> {
  static isTransformer = true;

  constructor(
    public toLocalValue: (value: unknown) => LocalValue,
    public toDatabaseValue: (value: LocalValue) => DbValue,
  ) {
  }
}
