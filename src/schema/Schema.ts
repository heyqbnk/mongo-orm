import {
  ISchemaCtr, ISchemaExtendedProps,
  IToDocumentOptions,
  TSchemaDefinition,
  TSchemaDocument,
  TSchemaProperties,
} from './types';
import {IUnpackedFieldMeta} from '../types';
import {Filter} from 'mongodb';
import {IncorrectFieldValueError} from '../errors';
import {unpackFieldMeta} from '../utils';
import {createSchemaCtrFields, ICreateSchemaOptions} from './utils';

type TDbPropertyName = string;
type TClassPropertyName = string;
type TFieldNamesMapping = Record<TClassPropertyName, TDbPropertyName>;

/**
 * Creates new schema class from schema definition definition.
 * @param schema
 * @param options
 */
export function createSchema<S extends TSchemaDefinition, O extends ICreateSchemaOptions>(
  schema: S,
  options: O,
): ISchemaCtr<S, O> {
  const {name, source} = options;

  // Create field metas from schema.
  const fields = createSchemaCtrFields(schema);

  // Create mapping, where key is class property name and value is document
  // property name.
  const fieldNames = fields.reduce<TFieldNamesMapping>((acc, f) => {
    acc[f.classPropertyName] = f.dbPropertyName;
    return acc;
  }, {});

  /**
   * List of unpacked schema fields.
   */
  let unpackedFields: IUnpackedFieldMeta[] | undefined;

  /**
   * Schema primary field.
   */
  let primaryField: IUnpackedFieldMeta | null | undefined;

  /**
   * Applies database value to schema instance
   * @param schema
   * @param document
   */
  const applyDocument = (schema: Schema, document: TSchemaDocument<S>) => {
    // For each unpacked field, assign class property name.
    Schema.unpackedFields.forEach(f => {
      // Define field. We compute field value. In case, something is wrong,
      // this method will throw an error.
      defineField(schema, f, computeFieldValue(document, f))
    });
  }

  /**
   * Applies schema properties to schema instance.
   * @param schema
   * @param properties
   */
  const applyProperties = (
    schema: Schema,
    properties: TSchemaProperties<S>,
  ) => {
    Schema.unpackedFields.forEach(f => {
      // FIXME: Поле может быть undefined когда это позволено, мы должны
      //  брать дефолт.
      defineField(schema, f, (properties as any)[f.classPropertyName]);
    });
  }

  /**
   * Computes field value according to its settings.
   * @param document
   * @param field
   */
  const computeFieldValue = (
    document: Record<any, any>,
    field: IUnpackedFieldMeta,
  ): unknown => {
    const {
      transformer, dbPropertyName, optionalDefaultValue,
      nullableDefaultValue, isNullable, isArray, isOptional,
    } = field;

    // Get value from document.
    let fieldValue = document[dbPropertyName];

    // Field is missing, check if it is allowed.
    if (fieldValue === undefined) {
      if (optionalDefaultValue !== undefined) {
        fieldValue = optionalDefaultValue;
      } else if (isOptional) {
        fieldValue = undefined;
      } else {
        // TODO: Separate error for undefined.
        throw new IncorrectFieldValueError(Schema, field, 'empty');
      }
    }
    // Field is equal to null. Check if it is allowed.
    else if (fieldValue === null) {
      if (nullableDefaultValue !== undefined) {
        fieldValue = nullableDefaultValue;
      } else if (isNullable) {
        fieldValue = undefined;
      } else {
        // TODO: Separate error for null.
        throw new IncorrectFieldValueError(Schema, field, 'empty');
      }
    }
    // Otherwise, just transform field.
    else {
      if (Array.isArray(fieldValue) !== isArray) {
        throw new IncorrectFieldValueError(
          Schema,
          field,
          Array.isArray(fieldValue) ? 'unexpected-array' : 'array-expected',
        );
      }
      fieldValue = Array.isArray(fieldValue)
        ? fieldValue.map(v => transformer.toLocalValue(v))
        : transformer.toLocalValue(fieldValue)
    }
    return fieldValue;
  }

  /**
   * Defines field in schema instance.
   * @param schema
   * @param field
   * @param value
   */
  const defineField = (
    schema: Schema,
    field: IUnpackedFieldMeta,
    value: any,
  ) => {
    if (value !== undefined) {
      // TODO: Transform on set?
      Object.defineProperty(schema, field.classPropertyName, {
        value,
        enumerable: true,
        writable: true,
        configurable: false,
      });
    }
  }

  /**
   * Formats filter atomic value.
   * @param value
   */
  const formatFilterValue = (value: unknown): unknown => {
    if (Array.isArray(value)) {
      return value.map(formatFilterValue);
    }
    if (typeof value === 'object' && value !== null) {
      return Object
        .entries(value)
        .reduce<Filter<unknown>>((acc, [key, value]) => {
          const fieldName = fieldNames[key] === undefined
            ? fieldNames[key]
            : key;

          (acc as any)[fieldName] = formatFilterValue(value);

          return acc;
        }, {});
    }
    return value;
  }

  /**
   * Schema which accepts collection document and returns its local
   * representation.
   */
  class Schema implements ISchemaExtendedProps<S> {
    static source = source;
    static schema = schema;

    /**
     * Formats filter before sending to database.
     * @param filter
     */
    static formatFilter(
      filter: Filter<TSchemaProperties<S>>
    ): Filter<TSchemaDocument<S>> {
      return Object
        .entries(filter)
        .reduce<Filter<TSchemaDocument<S>>>((acc, [key, value]) => {
          const fieldName = fieldNames[key] === undefined
            ? key
            : fieldNames[key];

          (acc as any)[fieldName] = formatFilterValue(value);

          return acc;
        }, {});
    }

    /**
     * Primary field of schema.
     */
    static get primaryField(): IUnpackedFieldMeta | null {
      if (primaryField === undefined) {
        primaryField = this
          .unpackedFields
          .find(f => f.isPrimary) || null;
      }
      return primaryField;
    }

    /**
     * Unpacked fields of schema.
     */
    static get unpackedFields(): IUnpackedFieldMeta[] {
      if (unpackedFields === undefined) {
        unpackedFields = fields.map(unpackFieldMeta);
      }
      return unpackedFields;
    }

    constructor(
      value: TSchemaDocument<S> | TSchemaProperties<S> | unknown,
      from?: 'properties' | 'unknown'
    ) {
      if (from === undefined) {
        applyDocument(this, value as TSchemaDocument<S>);
      } else if (from === 'properties') {
        applyProperties(this, value as TSchemaProperties<S>);
      } else {
        // TODO: Maybe, we should rethink it. We expect throwing error
        //  while constructing schema from incorrect document, but it looks too
        //  implicit.
        applyDocument(this, value as TSchemaDocument<S>);
      }
    }

    /**
     * Converts current schema to document presentation.
     * @param options
     */
    toDocument(options: IToDocumentOptions = {}): TSchemaDocument<S> {
      const {
        includeNullable = false,
        includeNullableDefaults = false,
        includeOptionalDefaults = false,
        includeOptional = false
      } = options;
      const document = {} as TSchemaDocument<S>;
      const assign = (property: string, value: any) => {
        (document as any)[property] = value;
      };

      Schema.unpackedFields.forEach(f => {
        const {
          classPropertyName,
          dbPropertyName,
          optionalDefaultValue,
          nullableDefaultValue,
        } = f;
        const schemaValue = (this as any)[classPropertyName];

        if (schemaValue === null) {
          if (includeNullableDefaults && nullableDefaultValue !== undefined) {
            const value = typeof nullableDefaultValue === 'function'
              ? nullableDefaultValue()
              : nullableDefaultValue;
            assign(dbPropertyName, value);
          } else if (includeNullable) {
            assign(dbPropertyName, null);
          }
        } else if (schemaValue === undefined) {
          if (includeOptionalDefaults && optionalDefaultValue !== undefined) {
            const value = typeof optionalDefaultValue === 'function'
              ? optionalDefaultValue()
              : optionalDefaultValue;
            assign(dbPropertyName, value);
          } else if (includeOptional) {
            assign(dbPropertyName, undefined);
          }
        } else {
          assign(dbPropertyName, Array.isArray(schemaValue)
            ? schemaValue.map(v => f.transformer.toDatabaseValue(v))
            : f.transformer.toDatabaseValue(schemaValue));
        }
      })
      return document;
    }
  }

  // Change schema class name.
  Object.defineProperty(Schema, 'name', {value: name});

  return Schema as any;
}