import {IUnpackedFieldMeta} from '../../types';
import {Filter} from 'mongodb';
import {TSchemaDefinition} from './misc';
import {TSchemaProperties} from './properties';
import {TSchemaDocument} from './document';
import {ITransformerCtr} from '../../Transformer';
import {TSchema} from './instance';

export interface IToDocumentOptions {
  /**
   * Should nullable fields be included in case they are currently null.
   * @default false
   */
  includeNullable?: boolean;
  /**
   * Should nullable fields use their default value in case, it is passed.
   * @default false
   */
  includeNullableDefaults?: boolean;
  /**
   * Should optional fields be included in case they are missing.
   * @default false
   */
  includeOptional?: boolean;
  /**
   * Should optional fields use their default value in case, it is passed.
   * @default false
   */
  includeOptionalDefaults?: boolean;
}

/**
 * Constructor which creates schema instances by specified schema definition.
 */
export interface ISchemaCtr<Schema extends TSchemaDefinition,
  Options extends { source?: string } = {}> {
  /**
   * Creates schema instance from full document.
   * @param document
   */
  new(document: TSchemaDocument<Schema>): TSchema<Schema>;
  /**
   * Creates schema instance from minimal set of properties.
   * @param properties
   * @param from
   */
  new(
    properties: TSchemaProperties<Schema>,
    from: 'properties',
  ): TSchema<Schema>;
  /**
   * Tries to create schema instance from unknown value. In case, passed value
   * is incorrect, an error will be thrown.
   * @param data
   * @param from
   */
  new(data: unknown, from: 'unknown'): TSchema<Schema>;
  /**
   * Formats filter before sending it to database.
   * @param filter
   */
  formatFilter(
    filter: Filter<TSchemaProperties<Schema>>
  ): Filter<TSchemaDocument<Schema>>;
  /**
   * Primary field of schema.
   */
  primaryField: IUnpackedFieldMeta | null;
  /**
   * Default schema source.
   */
  source: Options['source'];
  /**
   * Schema, used to create instances.
   */
  schema: Schema;
}

/**
 * Returns value which is hidden inside schema constructor.
 */
export type TSchemaCtrValue<T, IsLocal extends boolean> =
  T extends { schema: infer S }
    ? S extends object
      ? IsLocal extends true
        ? TSchemaProperties<S>
        : TSchemaDocument<S>
      : never
    : never;

export type TSchemaCtrTransformerCtr<T> = T extends ISchemaCtr<infer S>
  ? ITransformerCtr<TSchemaProperties<S>, TSchemaDocument<S>>
  : never;