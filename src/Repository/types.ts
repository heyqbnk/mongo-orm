import {
  TSchemaDefinition,
  TSchema,
  TSchemaProperties,
  TSchemaDocument,
  TSchemaDocumentMinimum,
} from '../schema';
import {Filter, FindOptions} from 'mongodb';

export interface IRepository<Schema extends TSchemaDefinition> {
  /**
   * Finds documents by specified query and options.
   */
  find(): Promise<TSchema<Schema>[]>;
  find(
    filter: Filter<TSchemaProperties<Schema>>,
    options?: FindOptions,
  ): Promise<TSchema<Schema>[]>;

  /**
   * Saves passed document.
   * @param document
   */
  save(
    document: TSchemaDocument<Schema> | TSchemaDocumentMinimum<Schema>,
  ): Promise<TSchema<Schema>>;
  /**
   * Saves passed schema instance.
   * @param schema
   */
  save(schema: TSchema<Schema>): Promise<TSchema<Schema>>;
}