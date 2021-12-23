import {
  IDocument,
  IFieldMeta,
  IUnpackedFieldMeta,
  TAnySchema,
  TConstructor,
} from '../types';
import {Collection, Db, Filter, FindOptions} from 'mongodb';
import {ReflectUtils} from './ReflectUtils';

interface IModel<D extends IDocument> {
}

type TModelCtr<M extends IModel<any>> = TConstructor<M>;
type TModelDocument<M extends IModel<any>> = M extends IModel<infer D>
  ? D : never;

interface IGetFieldsResult {
  fields: IUnpackedFieldMeta[];
  identifierField: IUnpackedFieldMeta;
}

/**
 * Класс, который работает с моделями.
 */
export class Repository<Model extends IModel<any>> {
  private readonly collection: Collection<TModelDocument<Model>>;
  private fields: IUnpackedFieldMeta[];
  private identifierField: IUnpackedFieldMeta;

  constructor(
    private readonly ModelConstructor: TModelCtr<Model>,
    db: Db,
  ) {
    // Получаем полную информацию о модели.
    const {
      identifierField, fields, collection,
    } = ReflectUtils.collectModelInformation(ModelConstructor);

    // Применяем поля, которые в модели объявлены.
    ReflectUtils.applyFields(ModelConstructor);

    this.collection = db.collection(collection);
    this.fields = fields;
    this.identifierField = identifierField;
  }

  /**
   * Извлекает из полученной сущности значение для поля.
   * @param json
   * @param field
   * @private
   */
  private computeFieldValue(
    json: TAnySchema,
    field: IUnpackedFieldMeta,
  ): unknown {
    const {type, dbPropertyName, defaultValue, isNullable, isArray} = field;
    let fieldValue = (json as any)[dbPropertyName];

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
        // TODO: Ошибку
        throw new Error('Поле отсутствует');
      }
    } else {
      // Если требование массива отличается от фактически полученного типа,
      // то выбрасываем ошибку.
      if (Array.isArray(fieldValue) !== isArray) {
        // TODO: Ошибку
        throw new Error('Поле не является массивом');
      }

      fieldValue = Array.isArray(fieldValue)
        ? fieldValue.map(parser.parse)
        : parser.parse(fieldValue);
    }
    return fieldValue;
  }

  /**
   * Извлекает из сущности поля модели.
   * @private
   * @param json
   */
  private createModel(json: TModelDocument<Model>): Model {
    const instance = new this.ModelConstructor();

    // Объявляем скрытое свойство, в которое будет записываться реальный
    // документ.
    Object.defineProperty(instance, '__document', {
      value: json,
      writable: false,
      enumerable: true,
      configurable: false,
    });

    this.fields.forEach(f => {
      const {
        classPropertyName, dbPropertyName, defaultValue, isNullable, isArray,
        type, isIdentifier,
      } = f;

      (instance as any)[classPropertyName] = this.computeFieldValue(json, f);
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