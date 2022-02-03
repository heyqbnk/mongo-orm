import {TFieldType, TFieldTypeValue} from '../../schema';

type TFieldOptionsNullable<Default> = {
  /**
   * Default value in case it is null.
   */
  nullableDefaultValue?: null | Default | (() => (Default | null));
  /**
   * Is value allowed to be null.
   * @default false
   */
  nullable: true;
} | {
  nullable?: false;
};

type TFieldOptionsOptional<Default> = {
  /**
   * Default value in case it is missing.
   */
  optionalDefaultValue?: undefined | Default | (() => (Default | undefined));
  /**
   * Is value allowed to be optional.
   * @default false
   */
  optional: true;
} | {
  optional?: false;
};

interface IFieldOptionsNoEmpty<Default> {
  optional?: false;
  nullable?: false;
  /**
   * Default value, when it is missing or equal to null.
   */
  defaultValue?: Default;
}

interface IFieldOptionsBase {
  /**
   * Name of this property in document.
   * @default Class property name.
   */
  name?: string;
  /**
   * Is this field primary in schema. Usually used by Repository for saving or
   * searching by id.
   * @default false
   */
  primary?: boolean;
  /**
   * Should value be transformed on set.
   */
  transformOnSet?: boolean;
}

/**
 * Field initialization options.
 */
export type TFieldOptions<Default> =
  IFieldOptionsBase
  & (
  | (TFieldOptionsOptional<Default> & TFieldOptionsNullable<Default>)
  | IFieldOptionsNoEmpty<Default>
  );

/**
 * Field initialization options with type passed.
 */
export type TTypedFieldOptions<T> = TFieldOptions<TFieldTypeValue<T, true>> & {
  /**
   * Field type.
   */
  type: T;
};

/**
 * Any typed field options.
 */
export type TAnyTypedFieldOptions = TFieldType extends infer T
  ? T extends any
    ? TTypedFieldOptions<T>
    : never
  : never;
