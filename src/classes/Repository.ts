import {IDocument, IUnpackedFieldMeta, TConstructor} from '../types';
import {Collection, Db, Filter, FindOptions, WithId} from 'mongodb';
import {ReflectUtils} from './ReflectUtils';
import {ValueEmptyError} from '../errors/ValueEmptyError';
import {ArrayExpectedError} from '../errors/ArrayExpectedError';

export interface IModel<D extends IDocument> {
}

export type TModelCtr<M extends IModel<any>> = TConstructor<M>;
type TModelDocument<M> = M extends IModel<infer D>
  ? D : never;

/**
 * Класс, который работает с моделями.
 */
export class Repository<Model extends IModel<any>> {
  private readonly collection: Collection<TModelDocument<Model>>;
  private readonly fields: IUnpackedFieldMeta[];
  private readonly primaryField: IUnpackedFieldMeta;

  constructor(
    private readonly ModelConstructor: TModelCtr<Model>,
    db: Db,
  ) {
    // Применяем поля, которые в модели объявлены.
    ReflectUtils.applyFields(ModelConstructor);

    // Получаем полную информацию о модели.
    const {
      primaryField, fields, collection,
    } = ReflectUtils.collectModelInformation(ModelConstructor);
    this.collection = db.collection(collection);
    this.fields = fields;
    this.primaryField = primaryField;
  }

  /**
   * Извлекает из полученной сущности значение для поля.
   * @param document
   * @param field
   * @private
   */
  private computeFieldValue(
    document: WithId<TModelDocument<Model>>,
    field: IUnpackedFieldMeta,
  ): unknown {
    const {
      dataMapper, dbPropertyName, defaultValue, isNullable, isArray,
    } = field;
    let fieldValue = document[dbPropertyName];

    // Поле отсутствует, проверяем, допустима ли такая ситуация.
    if (fieldValue === undefined || fieldValue === null) {
      // Если есть значение по умолчанию, берём его.
      if (defaultValue !== undefined) {
        fieldValue = defaultValue;
      }
      // Если null допустим, то устанавливаем его.
      else if (isNullable) {
        fieldValue = null;
      }
      // В противном случае выбрасываем ошибку.
      else {
        throw new ValueEmptyError({
          field,
          document,
          documentFieldName: dbPropertyName,
        });
      }
    } else {
      // Если требование массива отличается от фактически полученного типа,
      // то выбрасываем ошибку.
      if (Array.isArray(fieldValue) !== isArray) {
        throw new ArrayExpectedError({field, value: fieldValue});
      }
      fieldValue = Array.isArray(fieldValue)
        ? fieldValue.map(dataMapper.parse)
        : dataMapper.parse(fieldValue);
    }
    return fieldValue;
  }

  /**
   * Извлекает из сущности поля модели.
   * @private
   * @param document
   */
  private createModel(document: WithId<TModelDocument<Model>>): Model {
    const instance = new this.ModelConstructor;

    // Объявляем скрытое свойство, в которое будет записываться реальный
    // документ.
    Object.defineProperty(instance, '__document', {
      value: document,
      writable: false,
      enumerable: true,
      configurable: false,
    });

    this.fields.forEach(f => {
      (instance as any)[f.classPropertyName] =
        this.computeFieldValue(document, f);
    });

    return instance;
  }

  async find(): Promise<Model[]>;
  async find(
    filter: Filter<TModelDocument<Model>>,
    options?: FindOptions,
  ): Promise<Model[]>;
  async find(
    filter?: Filter<TModelDocument<Model>>,
    options?: FindOptions,
  ): Promise<Model[]> {
    // TODO: projection?
    const entities = filter === undefined
      ? await this.collection.find().toArray()
      : await this.collection.find(filter, options).toArray();

    return entities.map(entity => this.createModel(entity));
  }
}