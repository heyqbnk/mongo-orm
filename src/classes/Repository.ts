import {IDocument, IUnpackedFieldMeta, TConstructor} from '../types';
import {Collection, Db, Filter, FindOptions, WithId} from 'mongodb';
import {ReflectUtils} from './ReflectUtils';
import {ArrayExpectedError, ValueEmptyError} from '../errors';

type TFieldNamesMapping = Record<string, string>

/**
 * Класс, который работает с моделями.
 */
export class Repository<Model> {
  private readonly collection: Collection<IDocument>;
  private readonly fields: IUnpackedFieldMeta[];
  private readonly fieldNames: TFieldNamesMapping;
  private readonly primaryField: IUnpackedFieldMeta;

  constructor(
    private readonly ModelConstructor: TConstructor<Model>,
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
    this.fieldNames = fields.reduce<TFieldNamesMapping>((acc, f) => {
      acc[f.classPropertyName] = f.dbPropertyName;
      return acc;
    }, {});
    this.primaryField = primaryField;
  }

  /**
   * Извлекает из полученной сущности значение для поля.
   * @param document
   * @param field
   * @private
   */
  private static computeFieldValue(
    document: WithId<any>,
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
  private createModel(document: WithId<any>): Model {
    const instance = new this.ModelConstructor;

    // Объявляем скрытое свойство, в которое будет записываться реальный
    // документ.
    Object.defineProperty(instance, '__document', {
      value: document,
      writable: false,
      enumerable: true,
      configurable: false,
    });

    // Для каждого поля модели пытаемся вычислить значение. Если значение
    // вычислить не удастся, будет выброшена ошибка. Назначать нам ничего нет
    // необходимости ввиду того, что геттеры, которые привязаны к модели
    // автоматически достанут значение из документа.
    this.fields.forEach(f => {
      Repository.computeFieldValue(document, f)
    });

    return instance;
  }

  /**
   * Форматирует значение фильтра.
   * @param value
   * @private
   */
  private formatFilterValue(value: unknown): unknown {
    if (Array.isArray(value)) {
      return value.map(f => this.formatFilterValue(value));
    }
    if (typeof value === 'object' && value !== null) {
      return Object
        .entries(value)
        .reduce<Filter<unknown>>((acc, [key, value]) => {
          const fieldName = this.fieldNames[key] === undefined
            ? this.fieldNames[key]
            : key;

          acc[fieldName] = this.formatFilterValue(value);

          return acc;
        }, {});
    }
    return value;
  }

  /**
   * Форматирует фильтр перед отправкой запроса.
   * @private
   * @param filter
   */
  private formatFilter(filter: Filter<Model>): Filter<unknown> {
    return Object
      .entries(filter)
      .reduce<Filter<unknown>>((acc, [key, value]) => {
        const fieldName = this.fieldNames[key] === undefined
          ? key
          : this.fieldNames[key];

        acc[fieldName] = this.formatFilterValue(value);

        return acc;
      }, {});
  }

  find(): Promise<Model[]>;
  find(
    filter: Filter<Model>,
    options?: FindOptions,
  ): Promise<Model[]>;
  async find(
    filter?: Filter<Model>,
    options?: FindOptions,
  ): Promise<Model[]> {
    const formattedFilter = filter === undefined
      ? null
      : this.formatFilter(filter);
    const entities = formattedFilter === null
      ? await this.collection.find().toArray()
      : await this.collection.find(formattedFilter, options).toArray();

    return entities.map(entity => this.createModel(entity));
  }

  findOne(): Promise<Model | null>;
  findOne(
    filter: Filter<Model>,
    options?: FindOptions,
  ): Promise<Model | null>;
  async findOne(
    filter?: Filter<Model>,
    options?: FindOptions,
  ): Promise<Model | null> {
    const formattedFilter = filter === undefined
      ? null
      : this.formatFilter(filter);
    const entity = formattedFilter === null
      ? await this.collection.findOne()
      : await this.collection.findOne(formattedFilter, options);

    return entity === null ? null : this.createModel(entity);
  }
}