import {
  createTransformerCtr,
  Transformer,
  TypeBasedParseError
} from '../../src';

/**
 * Custom Transformer to get value from document in upper case. It is not
 * recommended to use such types of transformers, but we will use it to show,
 * we can do anything with values from document.
 *
 * The reason it is not recommended is transformers are designed just to parse
 * value, not format. Formatting logic should be outside of transformers as
 * long as they can not control value being set directly in schema.
 */
export const UpperCaseString = createTransformerCtr<string, string>({
  // We define value Transformer from document to local context.
  toLocalValue(value: unknown): string {
    // We dont want to handle cases, when field value in DB is not string.
    // It is important to mention that you are allowed to handle values with
    // Transformer however you want. In this example, we just throw error.
    if (typeof value !== 'string') {
      throw new TypeBasedParseError(value, 'BankCardUserName');
    }
    return value.toUpperCase();
  },
  // Then, we define Transformer from local to database context. As long as
  // value could be set to any other string, we are transforming it to upper
  // case again.
  toDatabaseValue(value: string): string {
    return value.toUpperCase();
  },
  name: 'UpperCaseString',
});