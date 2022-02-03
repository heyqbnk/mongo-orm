import {
  ISchemaCtr,
  TSchemaDefinition,
  TSchema,
  TSchemaProperties,
  TSchemaDocument,
  TSchemaDocumentMinimum
} from '../schema';
import {Db} from '../Db';
import {PrimaryFieldNotFoundError, SourceUnknownError} from '../errors';
import {Collection, Filter, FindOptions} from 'mongodb';
import {IRepository} from './types';
import {IFieldMeta, IUnpackedFieldMeta} from '../types';

interface IConOptions {
  /**
   * Schema source.
   */
  source?: string;
}

export class Repository<Schema extends TSchemaDefinition>
  implements IRepository<Schema> {
  /**
   * Schema source collection.
   * @private
   */
  private readonly collection: Collection;
  /**
   * Name of primary field.
   * @private
   */
  private readonly primaryField: IUnpackedFieldMeta | IFieldMeta;
  /**
   * Schema constructor which is used to generate schema instances.
   * @private
   */
  private readonly Schema: ISchemaCtr<Schema>;

  constructor(
    db: Db,
    Schema: ISchemaCtr<Schema>,
    options: IConOptions = {},
  ) {
    if (Schema.primaryField === null) {
      throw new PrimaryFieldNotFoundError(Schema);
    }
    const source = options.source || Schema.source;

    // Repository requires source collection.
    if (typeof source !== 'string') {
      throw new SourceUnknownError(Schema);
    }
    this.Schema = Schema;
    this.primaryField = Schema.primaryField;
    this.collection = db.collection(source);
  }

  find(): Promise<TSchema<Schema>[]>;
  find(
    filter: Filter<TSchemaProperties<Schema>>,
    options?: FindOptions,
  ): Promise<TSchema<Schema>[]>;
  async find(
    filter?: Filter<TSchemaProperties<Schema>>,
    options?: FindOptions,
  ): Promise<TSchema<Schema>[]> {
    const formattedFilter = filter === undefined
      ? null
      : this.Schema.formatFilter(filter);
    const entities = formattedFilter === null
      ? await this.collection.find().toArray()
      : await this.collection.find(formattedFilter as any, options).toArray();

    return entities.map(entity => new this.Schema(entity, 'unknown'));
  }

  save(
    document: TSchemaDocument<Schema> | TSchemaDocumentMinimum<Schema>,
  ): Promise<TSchema<Schema>>
  save(schema: TSchema<Schema>): Promise<TSchema<Schema>>;
  async save(
    documentOrSchema:
      | TSchemaDocument<Schema>
      | TSchemaDocumentMinimum<Schema>
      | TSchema<Schema>,
  ): Promise<TSchema<Schema>> {
    const document = documentOrSchema instanceof this.Schema
      ? documentOrSchema.toDocument()
      : documentOrSchema;
    let id = (document as any)[this.primaryField.dbPropertyName];

    // In case, id was passed, it is required to update document.
    if (id !== undefined) {
      // Try to update document. Use upsert to be sure document will exist.
      await this.collection.updateOne(
        {[this.primaryField.dbPropertyName]: id},
        document,
        {upsert: true}
      );
    }
    // Otherwise, it is required to create new document.
    else {
      const {insertedId} = await this.collection.insertOne(document);
      id = insertedId;
    }
    // In case, schema instance was passed, just change id and return this
    // instance.
    if (documentOrSchema instanceof this.Schema) {
      (documentOrSchema as any)[this.primaryField.classPropertyName] = id;
      return documentOrSchema;
    }
    // Otherwise create schema instance with inserted id.
    return new this.Schema({
      ...document,
      [this.primaryField.dbPropertyName]: id
    } as TSchemaDocument<Schema>);
  }
}