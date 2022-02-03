import {IUnpackedFieldMeta} from '../types';

type TReason =
  | 'empty'
  | 'array-expected'
  | 'unexpected-array'
  | 'object-expected';

function getMessage(
  Schema: Function,
  field: IUnpackedFieldMeta,
  reason: TReason,
): string {
  let reasonMessage: string;

  switch (reason) {
    case 'array-expected':
      reasonMessage = 'Array expected.';
      break;
    case 'empty':
      reasonMessage = 'Value does not exist (equals to undefined or null).';
      break;
    case 'object-expected':
      reasonMessage = 'Object value expected.';
      break;
    case 'unexpected-array':
      reasonMessage = 'Non-array value expected.';
      break;
  }
  return `Unable to map property: "document.${field.dbPropertyName}"` +
    ` -> "${Schema.name}.${field.classPropertyName}": ` + reasonMessage;
}

export class IncorrectFieldValueError extends Error {
  constructor(
    public readonly Schema: Function,
    public readonly field: IUnpackedFieldMeta,
    reason: TReason
  ) {
    super(getMessage(Schema, field, reason));
    this.name = 'IncorrectValueError';

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, IncorrectFieldValueError);
    }
    Object.setPrototypeOf(this, IncorrectFieldValueError.prototype);
  }
}