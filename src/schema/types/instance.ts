import {TSchemaDefinition} from './misc';
import {TSchemaDocument} from './document';
import {IToDocumentOptions} from './constructor';
import {TSchemaProperties} from './properties';

/**
 * List of properties that are extended to schema instance.
 */
export interface ISchemaExtendedProps<Schema extends TSchemaDefinition> {
  /**
   * Converts current schema instance to document presentation.
   * @param options
   */
  toDocument(options?: IToDocumentOptions): TSchemaDocument<Schema>;
}

/**
 * Schema instance.
 */
export type TSchema<Schema extends TSchemaDefinition> =
  TSchemaProperties<Schema> & ISchemaExtendedProps<Schema>;

