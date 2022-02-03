import {TFieldType, TSchemaDefinition,} from './types';
import {isSchemaCtr, isTransformerCtr} from '../utils';
import {IFieldMeta} from '../types';

export interface ICreateSchemaOptions {
  /**
   * Schema name.
   */
  name: string;
  /**
   * Source collection.
   */
  source?: string;
}

/**
 * Creates field metas according to passed schema definition.
 * @param schema
 */
export function createSchemaCtrFields(schema: TSchemaDefinition): IFieldMeta[] {
  return Object
    .entries(schema)
    .map<IFieldMeta>(([classPropertyName, typeOrOptions]) => {
      let isNullable = false;
      let isOptional = false;
      let isPrimary = false;
      let type: TFieldType;
      let dbPropertyName = classPropertyName;
      let transformOnSet = false;
      let optionalDefaultValue: any;
      let nullableDefaultValue: any;

      // Options object.
      if (
        !isTransformerCtr(typeOrOptions) &&
        !isSchemaCtr(typeOrOptions) &&
        typeof typeOrOptions === 'object' &&
        !Array.isArray(typeOrOptions)
      ) {
        const {
          primary: optionsPrimary = isPrimary,
          type: optionsType,
          transformOnSet: optionsTransformOnSet = transformOnSet,
        } = typeOrOptions;
        dbPropertyName =
          'name' in typeOrOptions && typeof typeOrOptions.name === 'string'
            ? typeOrOptions.name
            : classPropertyName;
        type = optionsType;
        transformOnSet = optionsTransformOnSet;
        isPrimary = optionsPrimary;

        if ('defaultValue' in typeOrOptions) {
          optionalDefaultValue = typeOrOptions.defaultValue;
          nullableDefaultValue = typeOrOptions.defaultValue;
        } else {
          if ('optional' in typeOrOptions && typeOrOptions.optional) {
            isOptional = true;
            optionalDefaultValue = typeOrOptions.optionalDefaultValue;
          }
          if ('nullable' in typeOrOptions && typeOrOptions.nullable) {
            isNullable = true;
            nullableDefaultValue = typeOrOptions.nullableDefaultValue;
          }
        }
      }
      // Scalar, tuple, Transformer or schema constructor.
      else {
        type = typeOrOptions;
      }

      return {
        type, classPropertyName, isOptional, dbPropertyName,
        isNullable, transformOnSet, optionalDefaultValue, nullableDefaultValue,
        isPrimary,
      };
    });
}


