import {TAnyTypedFieldOptions} from '../../types';
import {TFieldType} from './field';

/**
 * Returns database field name for specified field.
 */
type TFieldDbName<Field, DefaultName> =
  Field extends { type: any; name: infer Name }
    ? Name
    : DefaultName;

/**
 * Any schema definition.
 */
export type TSchemaDefinition = {
  [fieldName: string]: TAnyTypedFieldOptions | TFieldType;
};

/**
 * Returns tuples, where local field names is on the first place and
 * document field name is on second.
 */
export type TSchemaFieldNames<Schema extends object> = {
  [Key in keyof Schema]: [Key, TFieldDbName<Schema[Key], Key>]
}[keyof Schema];