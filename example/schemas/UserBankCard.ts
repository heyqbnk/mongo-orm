import {createSchema} from '../../src';
import {BankCardExpiration, UpperCaseString} from '../transformers';

/**
 * User bank card.
 */
export const UserBankCard = createSchema({
  // We want name to always be in upper case. So, for this purpose we define
  // custom Transformer.
  name: UpperCaseString,
  // Bank card expiration date.
  expDate: BankCardExpiration,
}, {name: 'UserBankCard'});