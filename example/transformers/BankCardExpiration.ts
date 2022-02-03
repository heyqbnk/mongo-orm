import {
  createSchema, createTransformerCtr,
  isRecord,
  Transformer,
  TypeBasedParseError
} from '../../src';

interface IBankCardExp {
  year: number;
  month: number;
}

// const BankCardExpirationSchema = createSchema({
//   year: Number,
//   month: Number,
// }, {name: 'BankCardExpirationSchema'});

/**
 * Custom Transformer which is able to parse value as bank card expiration
 * date.
 *
 * In this Transformer, we could return an object with fields described in
 * IBankCardExp interface, but it is better to use schemas as much as you can.
 */
export const BankCardExpiration = createTransformerCtr<IBankCardExp, IBankCardExp | string>({
  toLocalValue(value: unknown): IBankCardExp {
    // Expecting 10/25
    if (typeof value === 'string') {
      const [month, year] = value.split('/').map(parseInt);

      if (!Number.isNaN(month) && !Number.isNaN(year)) {
        return {month, year}
      }
    }
    // Expecting object with interface IBankCardExp.
    else if (
      isRecord(value) &&
      typeof value.month === 'number' &&
      typeof value.year === 'number'
    ) {
      return {month: value.month, year: value.year};
    }
    throw new TypeBasedParseError(value, 'BankCardExpiration');
  },
  toDatabaseValue(value: IBankCardExp): IBankCardExp | string {
    return value;
  },
  name: 'BankCardExpiration'
});